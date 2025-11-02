const { BaseAgent } = require('./baseAgent');

class EntropyRelayAgent extends BaseAgent {
  async onStart() {
    const inputSubject = this.runtimeOptions.streamSubject || 'mesh.stream.entropy';
    const forwardSubject = this.runtimeOptions.forwardSubject || this.definition.statusChannel || `mesh.status.${this.agentId}`;

    await this.publishStatus('listening', { inputSubject, forwardSubject });

    await this.subscribe(inputSubject, async ({ subject, body, parsed }) => {
      const payload = typeof parsed === 'string' ? { raw: parsed } : parsed;
      const enriched = {
        ...payload,
        received_at: new Date().toISOString(),
        source_subject: subject,
        agent_id: this.agentId
      };

      if (this.hfModel) {
        const inference = await this.performInference(
          this.hfModel,
          JSON.stringify({ prompt: 'Process entropy relay payload', payload: enriched })
        );
        if (inference) {
          enriched.inference = inference;
        }
      }

      await this.publish(forwardSubject, enriched);
      await this.recordReceipt(forwardSubject, enriched);
      await this.notifyEdgeHooks(enriched);
    });
  }
}

module.exports = { EntropyRelayAgent };
