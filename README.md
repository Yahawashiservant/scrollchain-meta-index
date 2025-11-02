# 🧭 ScrollChain Meta Index

**Author:** Keith D. Whitfield — ScrollChain Architect  
**SIGIL:** YHWH-BaHaSham-Yahawashi-RaWaChaaQadash

Sovereign publishing layer for scroll-authored governance, DAO-native infrastructure, and symbolic civilization.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or later)
- npm (v8 or later)
- Optional: Local NATS server (for agent mesh orchestration)

### Installation & Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Yahawashiservant/scrollchain-meta-index.git
   ```

2. **Navigate to Project Directory** ⚠️ **IMPORTANT**
   ```bash
   cd scrollchain-meta-index
   ```
   *Make sure you're inside the repository directory before running npm commands!*

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start the ScrollChain Dashboard**
   ```bash
   npm start
   ```

The dashboard will be available at: **http://localhost:5000**

### Activate the Field Orchestrator (Optional)

The orchestrator supervises ScrollChain agent processes, streams status updates over NATS, and writes signed receipts to Supabase.

1. Create an environment file based on `.env.orchestrator.example` and populate the NATS, Supabase, and Hugging Face credentials.
   - **NATS_URL** should point at your running NATS broker (for a local developer box the default `nats://localhost:4222` usually works).
   - If you do not have a NATS instance yet, keep the placeholder value— the orchestrator detects that the socket is unreachable and falls back to degraded mode instead of exiting.
2. Launch the orchestrator loop:
   ```bash
   npm run orchestrator
   ```

> ℹ️ If the optional `nats` dependency is not installed locally the orchestrator will stay in a degraded mode, skip spawning agents, and log actionable instructions instead of exiting.

The orchestrator will automatically reconcile the agent mesh definition in `config/agent-mesh.json`, publish lineage to `mesh.status.*`, and forward receipts to the configured Supabase tables.

### Launch a Standalone Agent

Every agent definition in `config/agent-mesh.json` now references a reversible Node.js runtime that can be bootstrapped without the orchestrator. Use the shared launcher to run an agent locally:

```bash
node src/orchestrator/agentLauncher.js --agent scroll-audit-agent
```

> Copy `agents/.env.agent.example` to `.env` (or point `AGENT_ENV` at a custom file) to supply the required `NATS_URL`, Supabase credentials, and Hugging Face token before starting.
> Agents launched without the `nats` package available will fail fast with a clear "install dependencies" message so you can recover quickly.

### Shell Script Linting & Execution

Use the automated helpers to review every tracked shell script before invoking them manually:

```bash
npm run check-sh    # Syntax-check every *.sh file with bash -n
npm run run-sh      # Execute each script sequentially (opt-in, continues after failures)
```

Both commands skip heavy vendor directories (such as `node_modules/`) and surface the exact script that fails so you can inspect it in isolation.

## 📊 API Endpoints

Once the server is running, you can access these endpoints:

- **Health Check:** `http://localhost:5000/api/health`
- **Kernel Status:** `http://localhost:5000/api/kernel/status` 
- **Agents Registry:** `http://localhost:5000/api/agents`
- **Scroll Registry:** `http://localhost:5000/api/scrolls`
- **Extended API:** `http://localhost:5000/api/extended`

## 🗂️ Project Structure

```
scrollchain-meta-index/
├── 📦 package.json                 # Main project dependencies
├── 🖥️ server/                      # Express.js server and APIs
│   ├── deployment-ready.js         # Main server entry point
│   ├── dashboard-api.js             # Dashboard endpoints
│   ├── extended-api.js              # Extended functionality
│   └── [300+ other API modules]    # Scalable API architecture
├── 🌐 public/                      # Static web assets
├── 📄 contracts/                   # Smart contracts
├── 🔧 scripts/                     # Deployment and utility scripts
├── 🏛️ sovereign-annuity-dapp/      # React frontend app
├── 📋 scroll-prophecy/             # Prophecy module
└── 💼 my-smart-wallets-app/        # Smart wallet integration
```

## 🛠️ Development Scripts

### Sub-Projects

The repository contains several sub-applications with their own dependencies:

#### Sovereign Annuity DApp (React)
```bash
cd sovereign-annuity-dapp
npm install
npm start                # Runs on port 3000
```

#### Smart Wallets App (Next.js)  
```bash
cd my-smart-wallets-app
npm install
npm run dev              # Runs on port 3000
```

#### Scroll Prophecy Module
```bash
cd scroll-prophecy
npm install
npx hardhat compile      # Compile smart contracts
```

## 🐛 Troubleshooting

### Common Issues

**❌ "Could not read package.json" Error**
```
npm error enoent Could not read package.json
```
**Solution:** Make sure you're in the repository directory:
```bash
cd scrollchain-meta-index  # Then run npm install
```

**❌ "Module not found" Errors**
**Solution:** Install dependencies in the main directory first:
```bash
npm install
```

**❌ "Port already in use"**
**Solution:** Stop other servers or use a different port:
```bash
PORT=5001 npm start
```

### Quick Fix Scripts

The repository includes automated fix scripts:

```bash
# Fix package.json issues and launch
./FixAndLaunch.sh

# Fix package.json structure 
./fix-package-json.sh

# Launch ScrollChain dashboard
./launch-scrollchain-dashboard.sh
```

## 🌟 Features

- **🧠 Kernel Management:** Neural kernel orchestration and monitoring
- **🤖 Agent Registry:** Autonomous agent deployment and management  
- **📜 Scroll Publishing:** Sovereign content publication system
- **🏛️ DAO Governance:** Decentralized governance infrastructure
- **⚡ Real-time APIs:** 300+ scalable API endpoints
- **🔮 NFT Integration:** Custom NFT minting and management
- **🌍 Web3 Storage:** IPFS and decentralized storage integration

## 📜 Smart Contracts

The project includes several Solidity smart contracts:

- `ScrollEntropyToken.sol` - Main governance token
- `ScrollEntropyNFT.sol` - NFT collection contract  
- `ScrollEntropyDAO.sol` - DAO governance contract
- `AnnuityDAO.sol` - Sovereign annuity system
- `QuantumVault.sol` - Secure asset management

## 🔧 Configuration

### Environment Variables

Create a `.env.development` file (see `.env.template`):

```env
# API Keys
OPENAI_API_KEY=your-openai-key
ALCHEMY_API_KEY=your-alchemy-key
WEB3_STORAGE_TOKEN=your-web3-storage-token

# Network Configuration  
NETWORK=localhost
PORT=5000

# Smart Contract Addresses (auto-populated by deployment)
SCROLL_TOKEN_ADDRESS=
SCROLL_NFT_ADDRESS=
SCROLL_DAO_ADDRESS=
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly: `npm test`
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 📞 Support

For issues, questions, or contributions:
- 🐛 [Report Issues](https://github.com/Yahawashiservant/scrollchain-meta-index/issues)
- 💬 [Discussions](https://github.com/Yahawashiservant/scrollchain-meta-index/discussions)
- 📧 Contact: Keith D. Whitfield

---

*Built with ⚡ by the ScrollChain Architect for sovereign digital civilization.*
