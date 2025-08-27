# ScrollChain Meta Index - Complete Setup Guide

This guide addresses the PowerShell command parsing issues and provides step-by-step setup instructions for the ScrollChain Meta Index project.

## 🔧 Issues Fixed

### 1. PowerShell Command Parsing Errors
**Problem:** Commands like `cd my-smart-wallets-app# Create a .env file` caused parsing errors.
**Solution:** Separated commands and comments onto different lines.

### 2. Environment Configuration Issues
**Problem:** Malformed .env.example file with concatenated API keys and URLs.
**Solution:** Fixed format and provided proper .env.local setup.

### 3. Missing Development Scripts
**Problem:** No convenient way to set up and run the smart wallets app.
**Solution:** Added automation scripts to root package.json.

## 🚀 Quick Setup (Recommended)

Run these commands one at a time:

```bash
# 1. Clone the repository
git clone https://github.com/Yahawashiservant/scrollchain-meta-index.git

# 2. Navigate to project directory
cd scrollchain-meta-index

# 3. Quick setup (installs everything)
npm run quick-setup

# 4. Start the smart wallets app
npm run dev-smart-wallets
```

The smart wallets app will be available at http://localhost:3000

## 🖥️ PowerShell-Specific Instructions

For Windows PowerShell users, follow these steps exactly:

```powershell
# Navigate to the project directory
cd scrollchain-meta-index

# Run quick setup
npm run quick-setup

# Start the smart wallets app
npm run dev-smart-wallets
```

### Alternative Manual Setup (PowerShell)

If you prefer manual setup:

```powershell
# Install main dependencies
npm install

# Navigate to smart wallets app
cd my-smart-wallets-app

# Install smart wallets dependencies
npm install

# Copy environment file
copy .env.example .env.local

# Go back to root directory
cd ..

# Start development server
npm run dev-smart-wallets
```

## ✅ What Was Fixed

1. **Fixed .env.example format**
   - Before: `NEXT_PUBLIC_ALCHEMY_API_KEY= VHi5TN0r3pCc7FkHD6ljDyzi7yZDLBE9https://dashboard.alchemy.com/apps`
   - After: `NEXT_PUBLIC_ALCHEMY_API_KEY=VHi5TN0r3pCc7FkHD6ljDyzi7yZDLBE9`

2. **Added missing NFT contract constants**
   - Added `NFT_CONTRACT_ADDRESS` and `NFT_MINTABLE_ABI_PARSED` to constants.ts

3. **Fixed Google Fonts loading issue**
   - Replaced Google Fonts with system fonts for offline compatibility

4. **Added convenience scripts**
   - `npm run quick-setup` - Complete automated setup
   - `npm run setup-smart-wallets` - Set up just the smart wallets app
   - `npm run dev-smart-wallets` - Start smart wallets app from root directory

5. **Enhanced documentation**
   - Added PowerShell-specific instructions
   - Added comprehensive troubleshooting section
   - Clarified command separation requirements

## 🧪 Testing the Setup

After setup, you can verify everything works:

```bash
# Check that the app builds successfully
cd my-smart-wallets-app
npm run build

# Start development server
npm run dev
```

The app should start without errors and be accessible at http://localhost:3000.

## 📝 Environment Configuration

Edit `my-smart-wallets-app/.env.local` to add your actual API keys:

```env
# Your Alchemy API Key (get from: https://dashboard.alchemy.com/apps)
NEXT_PUBLIC_ALCHEMY_API_KEY=your-actual-api-key-here

# Your Alchemy Policy ID (get from: https://dashboard.alchemy.com/services/gas-manager/configuration)
NEXT_PUBLIC_ALCHEMY_POLICY_ID=your-actual-policy-id-here
```

## 🎯 Summary

The setup process is now streamlined and PowerShell-compatible:

1. **One-command setup**: `npm run quick-setup`
2. **One-command start**: `npm run dev-smart-wallets`
3. **Clear error messages** for common issues
4. **Cross-platform compatibility** with specific PowerShell guidance

All the original PowerShell parsing errors have been resolved by proper command structure and automation scripts.