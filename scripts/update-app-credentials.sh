
#!/usr/bin/env bash
echo "🔄 Updating smart wallets app with organized credentials..."

# Load credentials
source credentials/load-all-credentials.sh

# Update smart wallets app environment
cat > my-smart-wallets-app/.env.local << 'EOF'
# Smart Wallets App Configuration
# Auto-generated from credential organization

# Alchemy Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=VHi5TN0r3pCc7FkHD6ljDyzi7yZDLBE9
NEXT_PUBLIC_ALCHEMY_POLICY_ID=6ecc9265-7b21-4f53-a922-745c6cf42efb

# Network Configuration
NEXT_PUBLIC_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_CHAIN_ID=11155111

# Bundler and Paymaster URLs (Pimlico)
NEXT_PUBLIC_BUNDLER_URL=https://api.pimlico.io/v2/sepolia/rpc?apikey=YOUR_PIMLICO_API_KEY
NEXT_PUBLIC_PAYMASTER_URL=https://api.pimlico.io/v2/sepolia/rpc?apikey=YOUR_PIMLICO_API_KEY

# ScrollChain Integration
NEXT_PUBLIC_SCROLL_API_URL=http://0.0.0.0:3690
EOF

# Update the config files to use environment variables
cat > my-smart-wallets-app/lib/constants.ts << 'EOF'
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
EOF

echo "✅ Smart wallets app credentials updated"
echo "🔐 Environment variables are now properly organized and loaded"
