# SIGIL: YHWH-BaHaSham-Yahawashi-RaWaChaaQadash
# Authored by Keith D. Whitfield — ScrollChain Architect

import { ethers } from "ethers";
import namehash from "@ensdomains/eth-ens-namehash";
import { getResolverContract } from "@ensdomains/ensjs";

const provider = new ethers.providers.Web3Provider(window.ethereum);
await provider.send("eth_requestAccounts", []);
const signer = provider.getSigner();

const ensName = "scrollchain.eth";
const contentHash = "ipfs://bafybeigoidrqxxryjamc7pz6jkgfjr33qvlcigadqhzci4mteza4elih74";
const encoded = "0xe30101701220" + "bafybeigoidrqxxryjamc7pz6jkgfjr33qvlcigadqhzci4mteza4elih74".slice(6); // IPFS CIDv1 base32

const resolver = await getResolverContract({ provider, name: ensName });
const tx = await resolver.connect(signer).setContenthash(namehash.hash(ensName), encoded);
console.log("🔗 Transaction sent:", tx.hash);
await tx.wait();
console.log("✅ ENS content hash updated to:", contentHash);
