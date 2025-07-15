
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

class CredentialManager {
    constructor() {
        this.credentialsDir = path.join(process.cwd(), 'credentials');
        this.credentials = {};
        this.loadedServices = new Set();
    }

    // Load credentials from a specific service
    loadService(serviceName) {
        const serviceFiles = [
            path.join(this.credentialsDir, 'api', `${serviceName}.env`),
            path.join(this.credentialsDir, 'services', `${serviceName}.env`),
            path.join(this.credentialsDir, 'blockchain', `${serviceName}.env`)
        ];

        for (const filePath of serviceFiles) {
            if (fs.existsSync(filePath)) {
                this.loadEnvFile(filePath);
                this.loadedServices.add(serviceName);
                console.log(`✅ Loaded ${serviceName} credentials`);
                return true;
            }
        }
        
        console.warn(`⚠️  Service ${serviceName} not found`);
        return false;
    }

    // Load all available credentials
    loadAll() {
        const credentialDirs = ['api', 'services', 'blockchain', 'env'];
        
        for (const dir of credentialDirs) {
            const dirPath = path.join(this.credentialsDir, dir);
            if (fs.existsSync(dirPath)) {
                const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.env'));
                for (const file of files) {
                    this.loadEnvFile(path.join(dirPath, file));
                }
            }
        }
        
        console.log(`✅ Loaded credentials from ${this.loadedServices.size} services`);
    }

    // Load environment file
    loadEnvFile(filePath) {
        try {
            const content = fs.readFileSync(filePath, 'utf8');
            const lines = content.split('\n');
            
            for (const line of lines) {
                const trimmed = line.trim();
                if (trimmed && !trimmed.startsWith('#')) {
                    const [key, ...valueParts] = trimmed.split('=');
                    if (key && valueParts.length > 0) {
                        const value = valueParts.join('=');
                        this.credentials[key] = value;
                        process.env[key] = value;
                    }
                }
            }
        } catch (error) {
            console.error(`Error loading ${filePath}:`, error.message);
        }
    }

    // Get credential by key
    get(key) {
        return this.credentials[key] || process.env[key];
    }

    // Set credential
    set(key, value) {
        this.credentials[key] = value;
        process.env[key] = value;
    }

    // List all loaded credentials (masks sensitive values)
    list() {
        console.log('\n🔐 Loaded Credentials:');
        console.log('====================');
        
        for (const [key, value] of Object.entries(this.credentials)) {
            const maskedValue = this.maskSensitiveValue(key, value);
            console.log(`${key}=${maskedValue}`);
        }
    }

    // Mask sensitive credential values
    maskSensitiveValue(key, value) {
        const sensitiveKeywords = ['key', 'secret', 'token', 'password', 'private'];
        const isSensitive = sensitiveKeywords.some(keyword => 
            key.toLowerCase().includes(keyword)
        );
        
        if (isSensitive && value && value.length > 8) {
            return value.substring(0, 4) + '*'.repeat(value.length - 8) + value.substring(value.length - 4);
        }
        
        return value;
    }

    // Validate required credentials for ScrollChain
    validate() {
        const required = [
            'NEXT_PUBLIC_ALCHEMY_API_KEY',
            'NEXT_PUBLIC_ALCHEMY_POLICY_ID',
            'NEXT_PUBLIC_RPC_URL',
            'NEXT_PUBLIC_CHAIN_ID'
        ];

        const missing = required.filter(key => !this.get(key));
        
        if (missing.length > 0) {
            console.error('❌ Missing required credentials:');
            missing.forEach(key => console.error(`  - ${key}`));
            return false;
        }
        
        console.log('✅ All required credentials are present');
        return true;
    }

    // Export credentials for use in other modules
    export() {
        return { ...this.credentials };
    }
}

// CLI interface
if (require.main === module) {
    const manager = new CredentialManager();
    const command = process.argv[2];
    
    switch (command) {
        case 'load':
            const service = process.argv[3];
            if (service) {
                manager.loadService(service);
            } else {
                manager.loadAll();
            }
            break;
            
        case 'list':
            manager.loadAll();
            manager.list();
            break;
            
        case 'validate':
            manager.loadAll();
            manager.validate();
            break;
            
        case 'get':
            const key = process.argv[3];
            if (key) {
                manager.loadAll();
                console.log(manager.get(key) || 'Not found');
            } else {
                console.log('Usage: node credential-manager.js get <key>');
            }
            break;
            
        default:
            console.log(`
ScrollChain Credential Manager

Usage:
  node credential-manager.js load [service]  - Load credentials
  node credential-manager.js list           - List all credentials
  node credential-manager.js validate       - Validate required credentials
  node credential-manager.js get <key>      - Get specific credential

Examples:
  node credential-manager.js load alchemy
  node credential-manager.js load
  node credential-manager.js get NEXT_PUBLIC_ALCHEMY_API_KEY
            `);
    }
}

module.exports = CredentialManager;
