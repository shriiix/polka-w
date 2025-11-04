@echo off
REM Build script for ink! smart contract (Windows)
REM Run from project root: .\scripts\build-contract.bat

echo 🦀 Building ink! Smart Contract...
echo.

REM Check if cargo-contract is installed
where cargo-contract >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ cargo-contract not found!
    echo Install it with: cargo install cargo-contract --force
    exit /b 1
)

REM Navigate to contracts directory
cd contracts

echo 📦 Cleaning previous build...
cargo clean

echo 🔨 Building contract (release mode)...
cargo contract build --release

echo.
echo ✅ Build complete!
echo.
echo 📄 Generated files:
echo   - target\ink\backup_registry.wasm (contract bytecode)
echo   - target\ink\backup_registry.json (contract metadata/ABI)
echo.

echo 🚀 Next steps:
echo   1. Deploy to Canvas: https://contracts-ui.substrate.io/
echo   2. Or deploy via CLI: cargo contract instantiate --constructor new --suri //Alice
echo   3. Update CONTRACT_ADDRESS in lib\constants.ts

cd ..
