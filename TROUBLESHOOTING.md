# 🔧 ScrollChain Troubleshooting Guide

## Common Setup Issues

### ❌ "Could not read package.json" Error

**Problem:** 
```
npm error enoent Could not read package.json: Error: ENOENT: no such file or directory
```

**Root Cause:** You're running `npm install` from the wrong directory.

**Solution:**
1. Make sure you're in the repository directory:
   ```bash
   cd scrollchain-meta-index
   pwd  # Should show: /path/to/scrollchain-meta-index
   ```
2. Then run:
   ```bash
   npm install
   ```

### ❌ Server Won't Start

**Problem:** SyntaxError about duplicate variable declarations

**Solution:** The server has been fixed. Update to the latest version and run:
```bash
npm start
```

### ❌ "Port already in use"

**Problem:** 
```
Error: listen EADDRINUSE :::5000
```

**Solution:** Use a different port:
```bash
PORT=5001 npm start
```

### ❌ Missing Dependencies

**Problem:** Module not found errors

**Solution:** Install all dependencies for all sub-projects:
```bash
npm run install-all
```

## Quick Fixes

### 🔄 Reset Everything
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or use the automated fix script
./FixAndLaunch.sh
```

### 🧪 Test Server
```bash
# Start server
npm start

# In another terminal, test health
npm run health
```

### 📊 Check What's Running
```bash
# See what's using port 5000
lsof -i :5000

# Or check all listening ports
netstat -tulpn | grep LISTEN
```

## Environment Setup

### Required Node.js Version
```bash
node --version  # Should be v18 or later
npm --version   # Should be v8 or later
```

### Directory Structure Check
Make sure your directory looks like this:
```
scrollchain-meta-index/
├── package.json          ✅ Should exist
├── server/               ✅ Should exist  
├── README.md             ✅ Should exist
└── node_modules/         ✅ Created after npm install
```

## Getting Help

1. **Check the logs:** Look at the server output for specific error messages
2. **Verify setup:** Run through the installation steps in README.md again  
3. **Reset state:** Try the automated fix scripts
4. **Report issues:** Create an issue with:
   - Operating system
   - Node.js/npm versions  
   - Complete error message
   - Steps you tried

---

*For more help, see README.md or create an issue on GitHub.*