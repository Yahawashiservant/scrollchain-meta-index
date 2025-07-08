import * as w3up from '@web3-storage/w3up-client';

(async ()=>{
  const client = await w3up.create();
  // this will re-send the login/delegation email to your address
  await client.login('keithdwhitfield@gmail.com');
  console.log('✅ Login email re-sent to keithdwhitfield@gmail.com – check spam/junk now.');
})();