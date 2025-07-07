import { Web3Storage, getFilesFromPath } from 'web3.storage';
const token = '6b216f12.3244a19773cb4ac792908eab0cb4c45c'; // your token

async function main() {
  const storage = new Web3Storage({ token });
  const files = await getFilesFromPath('./prophecy-viewer');
  const cid = await storage.put(files, { wrapWithDirectory: true });
  console.log('✅ Pinned to IPFS:');
  console.log(`🔗 https://ipfs.io/ipfs/${cid}`);
}

main();