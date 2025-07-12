export class CodexFeedListener {
  static broadcastMint(tokenId: string, payload: any) {
    console.log(`🪙 Mint event: ${tokenId} ➝ ${JSON.stringify(payload)}`);
  }
  static broadcastEntropySpike(value: number) {
    if (value > 50) console.log(`🔥 Entropy spike: ${value}`);
  }
  static broadcastSymbolTrigger(symbol: string) {
    console.log(`🔔 Symbol triggered: ${symbol}`);
  }
}
