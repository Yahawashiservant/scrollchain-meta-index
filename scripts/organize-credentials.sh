
#!/usr/bin/env bash
echo "🔐 Organizing all credentials from ScrollChain repository..."

# Create credentials directory structure
mkdir -p credentials/{env,api,blockchain,services,encrypted}

echo "📋 Scanning for credentials across the repository..."

# Extract environment variables from various files
echo "🔍 Extracting environment variables..."

# From secrets directory
if [ -f "secrets/prod.env.enc" ]; then
    echo "Found encrypted production environment file"
    cp secrets/prod.env.enc credentials/encrypted/
fi

# Extract API keys and credentials from codebase
echo "🔑 Extracting API credentials..."

# Alchemy credentials from encrypted secrets
cat > credentials/blockchain/alchemy.env << 'EOF'
# Alchemy API Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=VHi5TN0r3pCc7FkHD6ljDyzi7yZDLBE9
NEXT_PUBLIC_ALCHEMY_POLICY_ID=6ecc9265-7b21-4f53-a922-745c6cf42efb
EOF

# Smart Wallets configuration
cat > credentials/api/smart-wallets.env << 'EOF'
# Smart Wallets Configuration
NEXT_PUBLIC_BUNDLER_URL=https://api.pimlico.io/v2/sepolia/rpc?apikey=YOUR_PIMLICO_API_KEY
NEXT_PUBLIC_PAYMASTER_URL=https://api.pimlico.io/v2/sepolia/rpc?apikey=YOUR_PIMLICO_API_KEY
NEXT_PUBLIC_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_CHAIN_ID=11155111
EOF

# Supabase configuration (from error logs)
cat > credentials/services/supabase.env << 'EOF'
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
EOF

# ScrollChain specific credentials
cat > credentials/api/scrollchain.env << 'EOF'
# ScrollChain API Configuration
SCROLL_API_PORT=3690
SCROLL_ENTROPY_ENDPOINT=/api/codex/entropy
SCROLL_MINT_ENDPOINT=/mint
SCROLL_GEOMETRY_ENDPOINT=/geometry
EOF

# Blockchain network configurations
cat > credentials/blockchain/networks.env << 'EOF'
# Blockchain Network Configuration
ETHEREUM_MAINNET_RPC=https://ethereum-rpc.publicnode.com
ETHEREUM_SEPOLIA_RPC=https://ethereum-sepolia-rpc.publicnode.com
SCROLL_MAINNET_RPC=https://rpc.scroll.io
SCROLL_SEPOLIA_RPC=https://sepolia-rpc.scroll.io
EOF

# Git and repository credentials template
cat > credentials/services/git.env << 'EOF'
# Git Configuration
GIT_USERNAME=your_github_username
GIT_TOKEN=your_github_personal_access_token
GIT_URL=https://username:token@github.com/user/repo.git
EOF

# IPFS and Web3 storage credentials
cat > credentials/services/web3-storage.env << 'EOF'
# Web3 Storage Configuration
IPFS_GATEWAY=https://ipfs.io/ipfs/
WEB3_STORAGE_TOKEN=your_web3_storage_token
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
EOF

# Create master credential loader
cat > credentials/load-all-credentials.sh << 'EOF'
#!/usr/bin/env bash
echo "🔐 Loading all ScrollChain credentials..."

# Load all environment files
for env_file in credentials/*/*.env; do
    if [ -f "$env_file" ]; then
        echo "Loading: $env_file"
        export $(grep -v '^#' "$env_file" | xargs)
    fi
done

echo "✅ All credentials loaded into environment"
EOF

chmod +x credentials/load-all-credentials.sh

# Create credential validation script
cat > credentials/validate-credentials.sh << 'EOF'
#!/usr/bin/env bash
echo "🔍 Validating ScrollChain credentials..."

# Check required environment variables
required_vars=(
    "NEXT_PUBLIC_ALCHEMY_API_KEY"
    "NEXT_PUBLIC_ALCHEMY_POLICY_ID"
    "NEXT_PUBLIC_RPC_URL"
    "NEXT_PUBLIC_CHAIN_ID"
)

missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        missing_vars+=("$var")
    else
        echo "✅ $var is set"
    fi
done

if [ ${#missing_vars[@]} -ne 0 ]; then
    echo "❌ Missing required variables:"
    printf '%s\n' "${missing_vars[@]}"
    exit 1
else
    echo "✅ All required credentials are present"
fi
EOF

chmod +x credentials/validate-credentials.sh

# Create credential usage guide
cat > credentials/README.md << 'EOF'
# ScrollChain Credentials Management

## Overview
This directory contains all credentials and API keys used across the ScrollChain ecosystem.

## Structure
- `env/` - Environment-specific configurations
- `api/` - API keys and service credentials
- `blockchain/` - Blockchain network configurations
- `services/` - Third-party service credentials
- `encrypted/` - Encrypted credential files

## Usage

### Load All Credentials
```bash
source credentials/load-all-credentials.sh
```

### Validate Credentials
```bash
./credentials/validate-credentials.sh
```

### Individual Service Loading
```bash
# Load specific service credentials
source credentials/api/scrollchain.env
source credentials/blockchain/alchemy.env
```

## Security Notes
- Never commit unencrypted credentials to version control
- Use environment variables for sensitive data
- Rotate API keys regularly
- Use different credentials for different environments

## Services Configured
1. **Alchemy** - Ethereum/Blockchain API
2. **Smart Wallets** - Account abstraction
3. **Supabase** - Database and backend services
4. **IPFS/Web3 Storage** - Decentralized storage
5. **Git** - Version control access
6. **ScrollChain API** - Internal API services
EOF

echo "📁 Creating consolidated environment file..."

# Create master .env file for development
cat > .env.development << 'EOF'
# ScrollChain Development Environment
# Generated automatically - DO NOT COMMIT TO VERSION CONTROL

# Alchemy Configuration
NEXT_PUBLIC_ALCHEMY_API_KEY=VHi5TN0r3pCc7FkHD6ljDyzi7yZDLBE9
NEXT_PUBLIC_ALCHEMY_POLICY_ID=6ecc9265-7b21-4f53-a922-745c6cf42efb

# Network Configuration
NEXT_PUBLIC_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_CHAIN_ID=11155111

# ScrollChain API
SCROLL_API_PORT=3690
SCROLL_ENTROPY_ENDPOINT=/api/codex/entropy

# Development URLs
NEXT_PUBLIC_BUNDLER_URL=https://api.pimlico.io/v2/sepolia/rpc?apikey=YOUR_PIMLICO_API_KEY
NEXT_PUBLIC_PAYMASTER_URL=https://api.pimlico.io/v2/sepolia/rpc?apikey=YOUR_PIMLICO_API_KEY

# Supabase (configure these with your actual values)
SUPABASE_URL=your_supabase_url_here
SUPABASE_ANON_KEY=your_supabase_anon_key_here
EOF

echo "✅ Credential organization complete!"
echo "📖 Check credentials/README.md for usage instructions"
echo "🔐 Run 'source credentials/load-all-credentials.sh' to load all credentials"
