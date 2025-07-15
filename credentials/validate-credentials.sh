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
