# 🚀 ScrollChain Meta Index - Local Development Guide

This guide helps you set up and run the ScrollChain Meta Index project entirely on your local machine instead of using Vercel.

## ✅ Prerequisites Verified

- ✅ Node.js v20.19.4 (recommended: v18 or later)
- ✅ npm v10.8.2 (recommended: v8 or later)

## 🏗️ Project Structure

The project contains several components that can run independently:

```
scrollchain-meta-index/
├── 🖥️  Main Dashboard (Express.js)     → http://localhost:5000
├── 🏛️  Sovereign Annuity DApp (React)  → http://localhost:3001
├── 💼 Smart Wallets App (Next.js)      → http://localhost:3002
└── 📋 Scroll Prophecy (Hardhat)        → Smart contracts
```

## 🔧 Setup Instructions

### 1. Clone and Navigate to Repository
```bash
git clone https://github.com/Yahawashiservant/scrollchain-meta-index.git
cd scrollchain-meta-index
```

### 2. Install All Dependencies
```bash
# Install dependencies for all sub-projects
npm run install-all
```

### 3. Set Up Environment Variables

#### Main Project (.env.local)
```bash
# Copy and customize the environment file
cp .env.template .env.local
# Edit .env.local with your API keys
```

#### Smart Wallets App
```bash
cd my-smart-wallets-app
cp .env.example .env.local
# Edit .env.local with your Alchemy API key and Policy ID
cd ..
```

## 🚀 Running the Applications

### Option A: Start All Services (Recommended)

**Terminal 1: Main Dashboard**
```bash
npm start
# Runs on: http://localhost:5000
```

**Terminal 2: Sovereign Annuity DApp**
```bash
cd sovereign-annuity-dapp
PORT=3001 npm start
# Runs on: http://localhost:3001
```

**Terminal 3: Smart Wallets App**
```bash
cd my-smart-wallets-app
PORT=3002 npm run dev
# Runs on: http://localhost:3002
```

**Terminal 4: Smart Contracts (Optional)**
```bash
cd scroll-prophecy
npx hardhat compile
npx hardhat node  # Start local blockchain
```

### Option B: Start Individual Services

#### Main ScrollChain Dashboard
```bash
npm start
# Access at: http://localhost:5000
```

#### Sovereign Annuity DApp (React)
```bash
cd sovereign-annuity-dapp
npm start  # Default port 3000, or use PORT=3001 npm start
```

#### Smart Wallets App (Next.js)
```bash
cd my-smart-wallets-app
npm run dev  # Default port 3000, or use PORT=3002 npm run dev
```

## 📡 API Endpoints

When the main dashboard is running, you can access:

- **Health Check**: http://localhost:5000/api/health
- **Kernel Status**: http://localhost:5000/api/kernel/status
- **Agents**: http://localhost:5000/api/agents
- **Scrolls**: http://localhost:5000/api/scrolls

## 🛠️ Troubleshooting

### Common Issues

**❌ "Could not read package.json" Error**
```bash
# Make sure you're in the repository directory
cd scrollchain-meta-index
pwd  # Should show: /path/to/scrollchain-meta-index
npm install
```

**❌ "Port already in use" Error**
```bash
# Use different ports
PORT=5001 npm start              # Main dashboard
PORT=3001 npm start              # React app
PORT=3002 npm run dev            # Next.js app
```

**❌ Missing API Keys**
- Edit `.env.local` files in the main directory and `my-smart-wallets-app/`
- Add your actual API keys for full functionality
- The applications will work with demo/placeholder values for basic testing

### Automated Fix Scripts

The repository includes several automated fix scripts:

```bash
# Fix package.json issues (use with caution)
./fix-package-json.sh

# Launch ScrollChain dashboard
./launch-scrollchain-dashboard.sh

# Full setup with Docker (requires Docker)
./FixAndLaunch.sh
```

## 🎯 Development Workflow

1. **Start Main Dashboard**: Always start with `npm start` in the root directory
2. **Add Sub-Applications**: Start additional apps as needed on different ports
3. **Test APIs**: Use the health endpoints to verify services are running
4. **Environment Variables**: Configure API keys for full functionality
5. **Smart Contracts**: Use Hardhat for blockchain development in `scroll-prophecy/`

## 🔗 Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| Main Dashboard | http://localhost:5000 | ScrollChain sovereign dashboard |
| Sovereign Annuity | http://localhost:3001 | React-based DApp |
| Smart Wallets | http://localhost:3002 | Next.js wallet interface |
| API Health | http://localhost:5000/api/health | Service status |

## 📚 Next Steps

1. **Configure API Keys**: Add real API keys to `.env.local` files for full functionality
2. **Explore Features**: Visit each service URL to explore the interfaces
3. **Smart Contracts**: Deploy and test contracts using the Hardhat setup
4. **Customization**: Modify components as needed for your specific use case

## 🆘 Need Help?

- Check `TROUBLESHOOTING.md` for detailed issue resolution
- Review `README.md` for comprehensive project documentation
- Create an issue on GitHub for specific problems

---

**Ready to build on ScrollChain!** 🎉