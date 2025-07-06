import { ethers } from 'ethers';
import { createClient } from '@supabase/supabase-js';
import QuantumEntropyDAOAbi from '../contracts/QuantumEntropyDAO.json';

const supabase = createClient(process.env.S_URL, process.env.S_KEY);
const provider  = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const dao       = new ethers.Contract(process.env.DAO_ADDRESS, QuantumEntropyDAOAbi, provider);

dao.on('Logged', async (id, q, note, by) => {
  await supabase.from('entropy_trails').insert([{
    ts: new Date().toISOString(),
    qhash: q,
    sample: [],
    note
  }]);
  console.log('Synced on-chain log:', id.toNumber(), q);
});
console.log('Listening for on-chain events…');
