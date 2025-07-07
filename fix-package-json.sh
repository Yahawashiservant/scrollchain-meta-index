
#!/usr/bin/env bash
set -euo pipefail

echo "🧹 Removing corrupted package.json"
rm -f package.json

echo "🧾 Writing clean package.json"
cat <<EOF > package.json
{
  "name": "scrollchain-infra",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "start": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "vite": "^3.2.11"
  }
}
EOF

echo "📦 Reinstalling dependencies"
rm -rf node_modules package-lock.json
npm install

echo "✅ Done. You can now run: PORT=5181 npm run dev"
