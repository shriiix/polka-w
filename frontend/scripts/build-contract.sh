#!/bin/bash

# Build script for ink! smart contract
# Run from project root: ./scripts/build-contract.sh

set -e

echo "🦀 Building ink! Smart Contract..."
echo ""

# Check if cargo-contract is installed
if ! command -v cargo-contract &> /dev/null; then
    echo "❌ cargo-contract not found!"
    echo "Install it with: cargo install cargo-contract --force"
    exit 1
fi

# Navigate to contracts directory
cd contracts

echo "📦 Cleaning previous build..."
cargo clean

echo "🔨 Building contract (release mode)..."
cargo contract build --release

echo ""
echo "✅ Build complete!"
echo ""
echo "📄 Generated files:"
echo "  - target/ink/backup_registry.wasm (contract bytecode)"
echo "  - target/ink/backup_registry.json (contract metadata/ABI)"
echo ""
echo "📊 Contract size:"
ls -lh target/ink/backup_registry.wasm | awk '{print "  " $5}'

echo ""
echo "🚀 Next steps:"
echo "  1. Deploy to Canvas: https://contracts-ui.substrate.io/"
echo "  2. Or deploy via CLI: cargo contract instantiate --constructor new --suri //Alice"
echo "  3. Update CONTRACT_ADDRESS in lib/constants.ts"
