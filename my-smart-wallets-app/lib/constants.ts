// Smart Wallets Constants with Environment Variables

export const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY!;
export const ALCHEMY_POLICY_ID = process.env.NEXT_PUBLIC_ALCHEMY_POLICY_ID!;

export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;
export const CHAIN_ID = parseInt(process.env.NEXT_PUBLIC_CHAIN_ID!);

export const BUNDLER_URL = process.env.NEXT_PUBLIC_BUNDLER_URL!;
export const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL!;

export const SCROLL_API_URL = process.env.NEXT_PUBLIC_SCROLL_API_URL || 'http://0.0.0.0:3690';

// Contract addresses and other constants
export const CONTRACTS = {
  // Add your deployed contract addresses here
  ANNUITY_DAO: '',
  PROPHECY_SCROLL: '',
  YIELD_SCROLL: '',
};

export const ENDPOINTS = {
  ENTROPY: '/api/codex/entropy',
  MINT: '/mint',
  GEOMETRY: '/geometry',
};
