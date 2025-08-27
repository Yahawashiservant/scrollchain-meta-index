# 🔧 ScrollChain Project Setup Guide

This guide addresses the common setup issues and provides step-by-step instructions for getting the scrollchain-meta-index project running.

## ❌ Common Issues and Solutions

### Issue 1: Wrong Directory
**Problem:** Running `npm install` in the wrong directory
**Solution:** Always navigate to the correct directory first

### Issue 2: Command Concatenation in PowerShell
**Problem:** Running multiple commands on one line without proper separators
```powershell
# ❌ This will fail:
cd my-smart-wallets-app# Create a .env file from the example
```

**Solution:** Run commands separately or use proper separators
```powershell
# ✅ Correct approach:
cd my-smart-wallets-app
# Create a .env file from the example
copy .env.example .env.local
# Install dependencies for the smart wallets app
npm install
# Run the development server
npm run dev
```

## 🚀 Step-by-Step Setup

### 1. Main Project Setup

```bash
# Navigate to project root
cd scrollchain-meta-index

# Install all dependencies for all sub-projects
npm run install-all

# Start the main ScrollChain dashboard
npm start
```

The dashboard will be available at: **http://localhost:5000**

### 2. Smart Wallets App Setup

```bash
# Navigate to smart wallets app
cd my-smart-wallets-app

# Create environment file (if not already done by install-all)
cp .env.example .env.local

# Edit .env.local with your API keys
# - Get NEXT_PUBLIC_ALCHEMY_API_KEY from: https://dashboard.alchemy.com/apps
# - Get NEXT_PUBLIC_ALCHEMY_POLICY_ID from: https://dashboard.alchemy.com/services/gas-manager/configuration

# Start development server
npm run dev
```

The smart wallets app will be available at: **http://localhost:3000**

### 3. Other Sub-Projects

#### Sovereign Annuity DApp (React)
```bash
cd sovereign-annuity-dapp
npm start  # Runs on port 3000
```

#### Scroll Prophecy Module (Hardhat)
```bash
cd scroll-prophecy
npx hardhat compile  # Compile smart contracts
```

## 🛠️ Quick Setup Script

For convenience, use the provided setup script:

```bash
# Make sure you're in the project root
./setup-smart-wallets.sh
```

This script will:
- ✅ Verify you're in the correct directory
- ✅ Create .env.local from .env.example if needed
- ✅ Install dependencies
- ✅ Provide next steps and useful commands

## 📝 Environment Variables Required

### Smart Wallets App (.env.local)
```env
NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_api_key_here
NEXT_PUBLIC_ALCHEMY_POLICY_ID=your_policy_id_here
NEXT_PUBLIC_RPC_URL=https://ethereum-sepolia-rpc.publicnode.com
NEXT_PUBLIC_CHAIN_ID=11155111
NEXT_PUBLIC_BUNDLER_URL=https://api.pimlico.io/v2/sepolia/rpc?apikey=YOUR_PIMLICO_API_KEY
NEXT_PUBLIC_PAYMASTER_URL=https://api.pimlico.io/v2/sepolia/rpc?apikey=YOUR_PIMLICO_API_KEY
NEXT_PUBLIC_SCROLL_API_URL=http://0.0.0.0:3690
```

## 🔍 Verification Steps

1. **Main Dashboard:** Visit http://localhost:5000 to see the ScrollChain dashboard
2. **Smart Wallets:** Visit http://localhost:3000 to see the smart wallets interface
3. **API Health:** Check http://localhost:5000/api/health for server status

## 📚 Available Scripts

### Main Project
- `npm start` - Start the main dashboard
- `npm run dev` - Start in development mode
- `npm run install-all` - Install dependencies for all sub-projects

### Smart Wallets App
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build
- `npm run lint` - Lint code

## 🐛 Troubleshooting

### Port Conflicts
If port 3000 or 5000 is already in use:
- Stop other applications using these ports
- Or modify the port in the respective configuration files

### API Key Issues
- Ensure you have valid Alchemy API keys
- Check that environment variables are properly set in .env.local
- Verify you're using the correct variable names (with NEXT_PUBLIC_ prefix)

### Permission Issues (Windows)
If you get permission errors:
- Run PowerShell/Command Prompt as Administrator
- Ensure Node.js and npm are properly installed

## 📞 Need Help?

If you encounter issues not covered here:
1. Check the main README.md for additional information
2. Review the TROUBLESHOOTING.md file
3. Open an issue on the GitHub repository