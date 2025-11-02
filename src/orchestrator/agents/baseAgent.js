const { EventEmitter } = require('events');
const crypto = require('crypto');
const path = require('path');

require('dotenv').config({ path: process.env.AGENT_ENV || path.resolve(process.cwd(), '.env') });

const log = (agentId, message, ...args) => {
  const prefix = `[Agent:${agentId}]`;
  console.log(prefix, message, ...args);
};

const missingNatsMessage =
  'NATS client dependency not installed. Run `npm install` (or add the `nats` package) before launching agents.';

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
    this.nats = null;
    this.supabaseFactory = null;
    this.supabaseClient = null;
    this.hfClient = null;
    this.subscriptions = [];
    this.sc = null;
    this.startedAt = null;
  }

  ensureNats() {
    if (this.nats && this.sc) {
      return;
    }

    try {
      this.nats = require('nats');
      this.sc = this.nats.StringCodec();
    } catch (error) {
      const err = new Error(missingNatsMessage);
      err.cause = error;
      throw err;
    }
  }

  async start() {
    if (!this.natsUrl) {
      throw new Error('NATS_URL missing for agent runtime.');
    }

    await this.initSupabase();
    await this.initHuggingFace();
    this.ensureNats();
    await this.initNats();

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
    this.ensureNats();
    this.natsConnection = await this.nats.connect({ servers: this.natsUrl, name: this.agentId });
    log(this.agentId, `Connected to NATS at ${this.natsUrl}`);
  }

  async initSupabase() {
    if (!this.supabaseUrl || !this.supabaseKey) {
      log(this.agentId, 'Supabase credentials missing - receipts disabled');
      return;
    }

    if (!this.supabaseFactory) {
      try {
        ({ createClient: this.supabaseFactory } = require('@supabase/supabase-js'));
      } catch (error) {
        log(this.agentId, 'Supabase client library missing - receipts disabled');
        return;
      }
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
    if (!this.natsConnection) {
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
    if (!this.natsConnection) {
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
    if (!this.natsConnection) {
      throw new Error('NATS connection not ready');
    }

    this.ensureNats();
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
}

module.exports = { BaseAgent };
