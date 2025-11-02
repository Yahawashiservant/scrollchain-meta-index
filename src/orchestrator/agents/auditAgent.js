const { BaseAgent } = require('./baseAgent');

class AuditAgent extends BaseAgent {
  async onStart() {
    const auditChannel = this.runtimeOptions.auditChannel || this.auditChannel;

    await this.publishStatus('listening', { auditChannel });

    await this.subscribe(auditChannel, async ({ subject, body }) => {
      await this.recordReceipt(subject, body);
      await this.notifyEdgeHooks({ subject, body, agentId: this.agentId });

      if (this.hfModel) {
        await this.performInference(this.hfModel, `Audit event for ${subject}: ${body}`);
      }
    });
  }
}

module.exports = { AuditAgent };
