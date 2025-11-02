const { EventEmitter } = require('events');
const crypto = require('crypto');
const path = require('path');

const { safeRequire } = require('../utils/optionalDependency');

require('dotenv').config({ path: process.env.AGENT_ENV || path.resolve(process.cwd(), '.env') });

const log = (agentId, message, ...args) => {
  const prefix = `[Agent:${agentId}]`;
  console.log(prefix, message, ...args);
};

const missingNatsMessage =
  'NATS client dependency not installed. Run `npm install` (or add the `nats` package) before launching agents.';

const missingNatsUrlMessage = 'NATS_URL missing for agent runtime.';

class BaseAgent extends EventEmitter {
  constructor(definition = {}, runtimeOptions = {}) {
    super();
    this.definition = definition;
    this.runtimeOptions = runtimeOptions;

    this.agentId = runtimeOptions.agentId || definition.id || process.env.AGENT_ID || crypto.randomUUID();
    this.natsUrl = runtimeOptions.natsUrl || process.env.NATS_URL;
    this.supabaseUrl = runtimeOptions.supabaseUrl || process.env.SUPABASE_URL;
    this.supabaseKey = runtimeOptions.supabaseKey || process.env.SUPABASE_KEY;
    this.hfToken = runtimeOptions.hfToken || process.env.HF_TOKEN;
    this.hfModel = runtimeOptions.huggingFaceModel || definition.huggingFaceModel || process.env.HF_MODEL;
    this.supabaseTable = runtimeOptions.supabaseTable || definition.supabaseTable || process.env.SUPABASE_TABLE;
    this.statusChannel = runtimeOptions.statusChannel || definition.statusChannel || `mesh.status.${this.agentId}`;
    this.auditChannel = runtimeOptions.auditChannel || definition.auditChannel || 'mesh.audit';
    this.edgeHooks = runtimeOptions.edgeHooks || definition.edgeHooks || [];
    this.receiptChannel = runtimeOptions.receiptChannel || definition.receiptChannel || this.statusChannel;

    this.natsConnection = null;
    this.nats = runtimeOptions.natsLib || safeRequire('nats', __dirname);
    this.supabaseFactory = runtimeOptions.supabaseLib?.createClient
      ? runtimeOptions.supabaseLib.createClient
      : null;
    if (!this.supabaseFactory) {
      const supabaseModule = runtimeOptions.supabaseLib || safeRequire('@supabase/supabase-js', __dirname);
      this.supabaseFactory = supabaseModule?.createClient || null;
    }
    this.supabaseClient = null;
    this.hfClient = null;
    this.subscriptions = [];
    this.sc = null;
    this.startedAt = null;
    this.meshEnabled = true;
    this.meshDisabledReason = null;
  }

  ensureNats() {
    if (!this.meshEnabled) {
      return false;
    }

    if (this.nats && this.sc) {
      return true;
    }

    if (!this.nats) {
      this.disableMesh(missingNatsMessage, 'NATS_CLIENT_MISSING');
      return false;
    }
    this.sc = this.nats.StringCodec();
    return true;
  }

  async start() {
    await this.initSupabase();
    await this.initHuggingFace();

    const codecReady = this.ensureNats();

    if (!this.natsUrl) {
      this.disableMesh(missingNatsUrlMessage, 'NATS_URL_MISSING');
    }

    if (codecReady && this.meshEnabled) {
      await this.initNats();
    }

    if (!this.meshEnabled) {
      const reasonSuffix = this.meshDisabledReason ? `: ${this.meshDisabledReason}` : '';
      log(this.agentId, `Mesh connectivity disabled${reasonSuffix}`);
    }

    this.startedAt = new Date();
    await this.publishStatus('starting');
    await this.onStart();
    await this.publishStatus('ready', { startedAt: this.startedAt.toISOString() });
    this.emit('ready');
    log(this.agentId, 'Agent runtime ready');
  }

  async stop(reason = 'shutdown') {
    await this.publishStatus('stopping', { reason });

    for (const sub of this.subscriptions) {
      try {
        await sub.drain?.();
      } catch (error) {
        log(this.agentId, 'Failed to drain subscription', error.message);
      }
    }
    this.subscriptions = [];

    if (this.natsConnection) {
      try {
        await this.natsConnection.drain();
      } catch (error) {
        log(this.agentId, 'Failed to drain NATS connection', error.message);
      }
      this.natsConnection = null;
    }

    this.emit('stopped');
  }

  async onStart() {
    throw new Error('onStart must be implemented by derived agent');
  }

  async initNats() {
    if (!this.meshEnabled) {
      return;
    }

    if (!this.ensureNats()) {
      return;
    }

    try {
      this.natsConnection = await this.nats.connect({ servers: this.natsUrl, name: this.agentId });
      log(this.agentId, `Connected to NATS at ${this.natsUrl}`);
    } catch (error) {
      this.disableMesh(`Failed to connect to NATS at ${this.natsUrl}: ${error.message}`, 'NATS_CONNECT_FAILED');
    }
  }

  async initSupabase() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      log(this.agentId, 'Supabase credentials missing - receipts disabled');
      return;
    }

    if (!this.supabaseFactory) {
      log(this.agentId, 'Supabase client library missing - receipts disabled');
      return;
    }

    this.supabaseClient = this.supabaseFactory(this.supabaseUrl, this.supabaseKey, {
      auth: { persistSession: false }
    });
    log(this.agentId, 'Supabase client initialised');
  }

  async initHuggingFace() {
    if (!this.hfToken) {
      log(this.agentId, 'HF_TOKEN missing - inference disabled');
      return;
    }
    if (typeof fetch !== 'function') {
      log(this.agentId, 'Global fetch unavailable - Hugging Face disabled');
      return;
    }

    const token = this.hfToken;
    this.hfClient = {
      async textGeneration({ model, inputs }) {
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
          log(this.agentId, 'Failed to parse Hugging Face response', error.message);
          return null;
        }
      }
    };
    log(this.agentId, 'Hugging Face client ready');
  }

  async publishStatus(status, metadata = {}) {
    if (!this.meshEnabled || !this.natsConnection) {
      return;
    }

    const payload = {
      agentId: this.agentId,
      status,
      timestamp: new Date().toISOString(),
      orchestratorId: process.env.ORCHESTRATOR_ID || null,
      ...metadata
    };

    await this.publish(this.statusChannel, payload);
    await this.recordReceipt(this.statusChannel, payload);
  }

  async publish(subject, payload) {
    if (!this.meshEnabled || !this.natsConnection) {
      return;
    }
    this.ensureNats();
    const data = typeof payload === 'string' ? payload : JSON.stringify(payload);
    await this.natsConnection.publish(subject, this.sc.encode(data));
  }

  async recordReceipt(subject, payload) {
    if (!this.supabaseClient || !this.supabaseTable) {
      return;
    }

    const data = {
      channel: subject,
      payload: typeof payload === 'string' ? payload : JSON.stringify(payload),
      agent_id: this.agentId,
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await this.supabaseClient.from(this.supabaseTable).insert(data);
      if (error) {
        throw error;
      }
    } catch (error) {
      log(this.agentId, 'Failed to persist receipt', error.message);
    }
  }

  async subscribe(subject, handler, options = {}) {
    if (!this.meshEnabled || !this.natsConnection) {
      log(this.agentId, `Subscription skipped for ${subject} - mesh connectivity unavailable`);
      return null;
    }

    if (!this.ensureNats()) {
      return null;
    }
    const subscription = this.natsConnection.subscribe(subject, options);
    this.subscriptions.push(subscription);

    (async () => {
      for await (const msg of subscription) {
        try {
          const body = this.sc.decode(msg.data);
          const parsed = this.safeParse(body);
          await handler({ subject: msg.subject, body, parsed, msg });
        } catch (error) {
          log(this.agentId, `Error handling message on ${msg.subject}`, error.message);
        }
      }
    })();

    return subscription;
  }

  async notifyEdgeHooks(payload) {
    if (!this.edgeHooks.length || typeof fetch !== 'function') {
      return;
    }

    await Promise.allSettled(
      this.edgeHooks.map(async (url) => {
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: typeof payload === 'string' ? payload : JSON.stringify(payload)
          });
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
        } catch (error) {
          log(this.agentId, `Edge hook ${url} failed`, error.message);
        }
      })
    );
  }

  async performInference(model, inputs) {
    if (!this.hfClient?.textGeneration) {
      return null;
    }

    try {
      return await this.hfClient.textGeneration({ model, inputs });
    } catch (error) {
      log(this.agentId, 'Hugging Face inference failed', error.message);
      return null;
    }
  }

  safeParse(value) {
    try {
      return JSON.parse(value);
    } catch (error) {
      return value;
    }
  }

  disableMesh(message, code) {
    this.meshEnabled = false;
    this.meshDisabledReason = message;
    const error = new Error(message);
    if (code) {
      error.code = code;
    }
    log(this.agentId, `${message} - continuing in offline mode`);
    return error;
  }
}

module.exports = { BaseAgent };
