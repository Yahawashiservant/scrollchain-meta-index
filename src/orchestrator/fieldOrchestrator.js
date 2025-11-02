const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const { spawn } = require('child_process');
const { safeRequire } = require('./utils/optionalDependency');
require('dotenv').config({ path: process.env.ORCHESTRATOR_ENV || path.resolve(process.cwd(), '.env') });

const log = (...args) => console.log('[FieldOrchestrator]', ...args);

class FieldOrchestrator extends EventEmitter {
  constructor(options = {}) {
    super();
    this.options = options;
    this.agentConfigPath = options.agentConfigPath || process.env.AGENT_CONFIG_PATH || path.resolve(process.cwd(), 'config/agent-mesh.json');
    this.resourceMapPath = options.resourceMapPath || process.env.RESOURCE_MAP_PATH || path.resolve(process.cwd(), 'config/resource-map.json');
    this.pollIntervalMs = options.pollIntervalMs || Number(process.env.ORCHESTRATOR_POLL_INTERVAL || 15000);
    this.natsUrl = options.natsUrl || process.env.NATS_URL;
    this.supabaseUrl = options.supabaseUrl || process.env.SUPABASE_URL;
    this.supabaseKey = options.supabaseKey || process.env.SUPABASE_KEY;
    this.orchestratorId = options.orchestratorId || process.env.ORCHESTRATOR_ID || 'scrollchain-field-orchestrator';
    this.hfToken = options.hfToken || process.env.HF_TOKEN;

    this.natsLib = options.natsLib || safeRequire('nats', __dirname);
    this.supabaseLib = options.supabaseLib || safeRequire('@supabase/supabase-js', __dirname);

    this.config = null;
    this.resourceMap = null;
    this.natsConnection = null;
    this.supabaseClient = null;
    this.hfClient = null;
    this.agentProcesses = new Map();
    this.agentRuntime = new Map();
    this.pollTimer = null;
  }

  async init() {
    await this.loadConfig();
    await this.loadResourceMap();
    await this.initSupabase();
    await this.initHuggingFace();
    await this.initNats();
    this.emit('ready');
    log('Orchestrator initialised');
  }

  async loadConfig() {
    try {
      const raw = fs.readFileSync(this.agentConfigPath, 'utf8');
      this.config = JSON.parse(raw);
      if (!Array.isArray(this.config.agents)) {
        throw new Error('Invalid agent configuration: missing agents array');
      }
      log(`Loaded configuration for ${this.config.agents.length} agent(s)`);
    } catch (error) {
      throw new Error(`Unable to load agent configuration from ${this.agentConfigPath}: ${error.message}`);
    }
  }

  async loadResourceMap() {
    try {
      const raw = fs.readFileSync(this.resourceMapPath, 'utf8');
      this.resourceMap = JSON.parse(raw);
      log('Resource map loaded');
    } catch (error) {
      log(`Resource map not loaded (${error.message}). Continuing with empty map.`);
      this.resourceMap = { supabase: {} };
    }
  }

  async initSupabase() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      log('Supabase credentials missing - receipt persistence disabled');
      return;
    }

    if (!this.supabaseLib?.createClient) {
      log('Supabase library not installed - receipt persistence disabled');
      return;
    }

    this.supabaseClient = this.supabaseLib.createClient(this.supabaseUrl, this.supabaseKey, {
      auth: { persistSession: false }
    });
    log('Supabase client initialised');
  }

  async initHuggingFace() {
    if (!this.hfToken) {
      log('HF_TOKEN missing - inference pipeline disabled');
      return;
    }
    if (typeof fetch !== 'function') {
      log('Global fetch unavailable - Hugging Face integration disabled');
      return;
    }

    const token = this.hfToken;
    this.hfClient = {
      async textGeneration({ model, inputs }) {
        if (!model) {
          throw new Error('Model name is required');
        }
        const response = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ inputs })
        });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        try {
          return await response.json();
        } catch (error) {
          log(`Non-JSON response from Hugging Face for ${model}: ${error.message}`);
          return null;
        }
      }
    };
    log('Hugging Face inference client ready');
  }

  async initNats() {
    if (!this.natsLib) {
      log('NATS client dependency missing - mesh connectivity disabled');
      return;
    }

    if (!this.natsUrl) {
      log('NATS_URL not provided - mesh connectivity disabled');
      return;
    }

    try {
      this.natsConnection = await this.natsLib.connect({ servers: this.natsUrl, name: this.orchestratorId });
      log(`Connected to NATS at ${this.natsUrl}`);

      const auditSub = this.natsConnection.subscribe('mesh.audit');
      (async () => {
        for await (const msg of auditSub) {
          this.handleAuditMessage(msg.subject, msg.data.toString());
        }
      })();

      const statusSub = this.natsConnection.subscribe('mesh.status.*');
      (async () => {
        for await (const msg of statusSub) {
          this.handleStatusMessage(msg.subject, msg.data.toString());
        }
      })();
    } catch (error) {
      this.natsConnection = null;
      log(`Failed to connect to NATS at ${this.natsUrl}: ${error.message}`);
    }
  }

  async start() {
    if (!this.config) {
      await this.init();
    }

    await this.reconcileAgents();
    this.pollTimer = setInterval(() => {
      this.reconcileAgents().catch((error) => {
        console.error('Reconciliation error', error);
      });
    }, this.pollIntervalMs);

    log('Orchestration loop started');
  }

  async stop() {
    if (this.pollTimer) {
      clearInterval(this.pollTimer);
      this.pollTimer = null;
    }

    for (const [agentId, processes] of this.agentProcesses.entries()) {
      for (const child of processes) {
        child.kill();
      }
      this.agentProcesses.delete(agentId);
    }

    if (this.natsConnection) {
      await this.natsConnection.drain();
      this.natsConnection = null;
    }
    log('Orchestrator stopped');
  }

  async reconcileAgents() {
    for (const agentDefinition of this.config.agents) {
      const desired = Math.max(agentDefinition.autoscale?.min ?? this.config.defaultDesiredInstances ?? 1, 0);
      const processes = this.agentProcesses.get(agentDefinition.id) || [];
      const delta = desired - processes.length;

      if (delta > 0) {
        for (let i = 0; i < delta; i += 1) {
          this.spawnAgent(agentDefinition);
        }
      } else if (delta < 0) {
        for (let i = 0; i < Math.abs(delta); i += 1) {
          const child = processes.pop();
          if (child) {
            child.kill();
          }
        }
        this.agentProcesses.set(agentDefinition.id, processes);
      }
    }
  }

  spawnAgent(definition) {
    if (!definition.spawn?.command) {
      log(`Agent ${definition.id} has no spawn command. Skipping instantiation.`);
      return;
    }

    if (!this.natsLib || !this.natsUrl || !this.natsConnection) {
      log(`Mesh connectivity unavailable - skipping spawn for ${definition.id}`);
      return;
    }

    const resolvedCwd = definition.spawn.cwd
      ? definition.spawn.cwd.replace('${PROJECT_ROOT}', process.cwd())
      : process.cwd();

    const child = spawn(definition.spawn.command, definition.spawn.args || [], {
      cwd: resolvedCwd,
      stdio: 'inherit',
      shell: true,
      env: {
        ...process.env,
        AGENT_ID: definition.id,
        SUPABASE_TABLE: definition.supabaseTable || '',
        HF_MODEL: definition.huggingFaceModel || '',
        AGENT_CONFIG_PATH: this.agentConfigPath
      }
    });

    const processes = this.agentProcesses.get(definition.id) || [];
    processes.push(child);
    this.agentProcesses.set(definition.id, processes);

    const runtimeEntry = this.agentRuntime.get(definition.id) || { instances: 0, crashes: 0 };
    runtimeEntry.instances += 1;
    this.agentRuntime.set(definition.id, runtimeEntry);

    child.on('exit', (code) => {
      const pool = this.agentProcesses.get(definition.id) || [];
      this.agentProcesses.set(definition.id, pool.filter((proc) => proc !== child));
      runtimeEntry.crashes += code === 0 ? 0 : 1;
      this.agentRuntime.set(definition.id, runtimeEntry);
      log(`Agent ${definition.id} exited with code ${code}`);
    });

    log(`Spawned agent ${definition.id}`);
    this.publishStatus(definition, 'spawned');
  }

  async handleAuditMessage(subject, message) {
    log(`Audit event from ${subject}: ${message}`);
    await this.recordReceipt('mesh.audit', message);
    this.emit('audit', { subject, message });
  }

  async handleStatusMessage(subject, message) {
    log(`Status update ${subject}: ${message}`);
    await this.recordReceipt(subject, message);
    this.emit('status', { subject, message });
  }

  async publishStatus(definition, status) {
    if (!this.natsConnection) {
      return;
    }
    const payload = JSON.stringify({
      orchestratorId: this.orchestratorId,
      agentId: definition.id,
      status,
      timestamp: new Date().toISOString()
    });
    const channel = definition.statusChannel || `mesh.status.${definition.id}`;
    await this.natsConnection.publish(channel, Buffer.from(payload));
    await this.recordReceipt(channel, payload);
    await this.notifyEdgeHooks(definition, payload);
  }

  async recordReceipt(channel, payload) {
    if (!this.supabaseClient) {
      return;
    }

    const table = this.findSupabaseTableForChannel(channel);
    if (!table) {
      return;
    }

    try {
      const { error } = await this.supabaseClient
        .from(table)
        .insert({
          channel,
          payload,
          orchestrator_id: this.orchestratorId,
          created_at: new Date().toISOString()
        });
      if (error) {
        throw error;
      }
    } catch (error) {
      console.error(`Failed to store receipt for ${channel}:`, error.message);
    }
  }

  findSupabaseTableForChannel(channel) {
    if (!this.resourceMap?.supabase) {
      return null;
    }

    const [subject] = channel.split('.').slice(-1);
    if (this.resourceMap.supabase[channel]) {
      return channel;
    }
    if (this.resourceMap.supabase[subject]) {
      return subject;
    }
    return null;
  }

  async notifyEdgeHooks(definition, payload) {
    if (!definition.edgeHooks || definition.edgeHooks.length === 0) {
      return;
    }
    if (typeof fetch !== 'function') {
      log('Global fetch not available - edge hook notifications skipped');
      return;
    }

    await Promise.allSettled(
      definition.edgeHooks.map(async (url) => {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: payload
          });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (error) {
          console.error(`Failed to notify edge hook ${url}:`, error.message);
        }
      })
    );
  }

  async mapResources() {
    if (!this.resourceMap?.supabase || !this.hfClient) {
      return;
    }

    for (const [table, mapping] of Object.entries(this.resourceMap.supabase)) {
      log(`Mapping Supabase table ${table} to Hugging Face model ${mapping.huggingFaceModel}`);
      try {
        await this.hfClient.textGeneration?.({
          model: mapping.huggingFaceModel,
          inputs: `Initialising linkage for ${table}`
        });
      } catch (error) {
        log(`Hugging Face initialisation for ${table} failed: ${error.message}`);
      }
    }
  }
}

async function main() {
  const orchestrator = new FieldOrchestrator();
  try {
    await orchestrator.init();
    await orchestrator.mapResources();
    await orchestrator.start();
  } catch (error) {
    console.error('Failed to start Field Orchestrator:', error.message);
    process.exitCode = 1;
  }

  const shutdown = async () => {
    log('Received shutdown signal');
    await orchestrator.stop();
    process.exit(0);
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

if (require.main === module) {
  main();
}

module.exports = { FieldOrchestrator };
