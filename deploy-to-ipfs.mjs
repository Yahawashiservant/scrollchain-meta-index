import * as w3up from '@web3-storage/w3up-client'
import { filesFromPaths } from 'files-from-path'

const client = await w3up.create()
await client.login('keithdwhitfield@gmail.com')

// ✅ List spaces that have already been delegated
const spaces = await client.spaces()
if (spaces.length === 0) {
  throw new Error('❌ No delegated spaces found. Check your email for a delegation request and approve it.')
}

const space = spaces[0]
await client.setCurrentSpace(space)

const files = await filesFromPaths(['./prophecy-viewer'])
const cid = await client.uploadDirectory(files)

console.log('✅ Pinned to IPFS:')
console.log(`🔗 https://ipfs.io/ipfs/${cid}`)