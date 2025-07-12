export async function CodexEntropyListener(entropyValue: number) {
  if (entropyValue > 50) {
    console.log(`🚨 GCF Entropy Trigger: Value → ${entropyValue}`);
    // Push to PubSub, update BigQuery
  }
}
