const fs = require('fs');
const path = require('path');

const env = {
  BIGQUERY_API_KEY: process.env.BIGQUERY_API_KEY,
  SUPABASE_URL: process.env.SUPABASE_URL,
  RPC_URL: process.env.RPC_URL
};

const kernelPath = process.argv[2];
if (!kernelPath) {
  console.error('❌ Usage: node run-kernel.js <kernel-file>');
  process.exit(1);
}

const kernel = require(path.resolve(kernelPath));
const instance = kernel(env);

console.log('🧠 Kernel Activated:', instance);
