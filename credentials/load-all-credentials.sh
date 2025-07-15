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
