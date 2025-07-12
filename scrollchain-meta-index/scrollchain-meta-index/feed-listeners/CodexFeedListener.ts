export class CodexFeedListener {
  static broadcastMint(tokenId: string, payload: any) {
    console.log(`🪙 Minted: ${tokenId} ➝ ${JSON.stringify(payload)}`);
  }
  static broadcastEntropySpike(value: number) {
    if (value > 50) console.log(`🔥 Entropy Spike: ${value}`);
  }
  static broadcastSymbolTrigger(symbol: string) {
    console.log(`🔔 Symbol Triggered: ${symbol}`);
  }
}
