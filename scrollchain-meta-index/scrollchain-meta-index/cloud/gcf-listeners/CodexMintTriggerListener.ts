export async function CodexMintTriggerListener(payload: any) {
  const { tokenId, data } = payload;
  console.log(`📡 GCF Trigger: Mint scroll ${tokenId}`);
  // Call IPFS pin + DAO publishing
}
