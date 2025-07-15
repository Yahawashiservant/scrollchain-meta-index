
import { config } from 'dotenv';

// Load environment variables
config();

export const API_KEYS = {
  ALCHEMY_API_KEY: process.env.ALCHEMY_API_KEY || process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
  GOOGLE_CLOUD_API_KEY: process.env.GOOGLE_CLOUD_API_KEY,
  NFT_STORAGE_API_KEY: process.env.NFT_STORAGE_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  SUPABASE_API_KEY: process.env.Supabase_Api_Key || process.env.SUPABASE_KEY,
  SUPABASE_DATABASE_ID: process.env.SupaBase_Database_ID,
  SUPABASE_URL: process.env.SUPABASE_URL,
  WEB3_STORAGE_API_TOKEN: process.env.Web3Storage_API_Token,
};

// Validate critical API keys
export function validateApiKeys() {
  const missing: string[] = [];
  
  if (!API_KEYS.SUPABASE_URL) missing.push('SUPABASE_URL');
  if (!API_KEYS.SUPABASE_API_KEY) missing.push('SUPABASE_KEY/Supabase_Api_Key');
  
  if (missing.length > 0) {
    console.error('Missing required API keys:', missing);
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ All critical API keys validated');
  return true;
}

// Initialize all services
export function initializeServices() {
  validateApiKeys();
  
  return {
    supabase: {
      url: API_KEYS.SUPABASE_URL!,
      key: API_KEYS.SUPABASE_API_KEY!,
    },
    alchemy: {
      apiKey: API_KEYS.ALCHEMY_API_KEY,
    },
    openai: {
      apiKey: API_KEYS.OPENAI_API_KEY,
    },
    nftStorage: {
      apiKey: API_KEYS.NFT_STORAGE_API_KEY,
    },
    web3Storage: {
      apiToken: API_KEYS.WEB3_STORAGE_API_TOKEN,
    },
    google: {
      apiKey: API_KEYS.GOOGLE_API_KEY,
      cloudApiKey: API_KEYS.GOOGLE_CLOUD_API_KEY,
    },
  };
}
