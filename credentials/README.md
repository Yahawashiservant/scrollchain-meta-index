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
