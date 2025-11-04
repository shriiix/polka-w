# 🦀 Polkadot Smart Contract - Backup Registry

## Overview

This directory contains the **ink!** smart contract for the ChainVault Web3 Cloud Backup system. The contract runs on Polkadot parachains with the Contracts pallet (like Canvas, Westend Contracts, or Astar).

## Contract Purpose

The `backup_registry` contract stores **METADATA ONLY** - never plaintext data or keys:

- 📝 **Backup Records**: Links between users and their IPFS manifest CIDs
- 🔐 **Encrypted Key Pointers**: CIDs pointing to encrypted key blobs (stored on IPFS)
- 👥 **Access Control**: Share/revoke access to backups with other users
- 📊 **Ownership Tracking**: Query backups by owner

## Architecture

```
┌─────────────────────────────────────────────────────┐
│  Frontend (Next.js + Polkadot.js)                   │
│  - Encrypts files locally                           │
│  - Uploads encrypted chunks to IPFS                 │
│  - Creates manifest JSON                            │
│  - Calls smart contract to register metadata        │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│  Smart Contract (backup_registry.wasm)              │
│  - Stores CID pointers (NOT data)                   │
│  - Manages ownership & sharing                      │
│  - Emits events for indexing                        │
└───────────────┬─────────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────────┐
│  IPFS / Web3.Storage                                │
│  - Stores encrypted file chunks                     │
│  - Stores manifest JSON                             │
│  - Stores encrypted key blobs                       │
└─────────────────────────────────────────────────────┘
```

## Prerequisites

### 1. Install Rust & Cargo

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Add wasm target
rustup component add rust-src
rustup target add wasm32-unknown-unknown
```

### 2. Install cargo-contract

```bash
# Install cargo-contract (ink! contract CLI)
cargo install cargo-contract --force
```

### 3. Verify Installation

```bash
cargo contract --version
# Should show: cargo-contract 4.x.x
```

## Build Contract

### Development Build

```bash
cd contracts
cargo contract build
```

### Release Build (Optimized)

```bash
cd contracts
cargo contract build --release
```

Build outputs:
- `target/ink/backup_registry.wasm` - Contract bytecode
- `target/ink/backup_registry.json` - Contract metadata (ABI)

## Testing

### Run Unit Tests

```bash
cd contracts
cargo test
```

### Run Integration Tests

```bash
cd contracts
cargo test --features e2e-tests
```

## Deployment

### Option 1: Deploy to Canvas Testnet

1. **Visit Contracts UI**: https://contracts-ui.substrate.io/

2. **Connect Wallet**: Use Polkadot.js extension

3. **Upload Contract**:
   - Click "Add New Contract"
   - Select "Upload New Contract Code"
   - Upload `backup_registry.wasm`
   - Upload `backup_registry.json`

4. **Instantiate**:
   - Select `new()` constructor
   - Set initial storage
   - Click "Instantiate"

5. **Save Contract Address**: Note the deployed contract address

### Option 2: Deploy via CLI

```bash
# Deploy to local node
cargo contract instantiate \
  --constructor new \
  --suri //Alice \
  --url ws://localhost:9944

# Deploy to Canvas testnet
cargo contract instantiate \
  --constructor new \
  --suri "your seed phrase" \
  --url wss://canvas-rpc.parity.io
```

### Option 3: Deploy to Westend Contracts

```bash
cargo contract instantiate \
  --constructor new \
  --suri "your seed phrase" \
  --url wss://westend-contracts-rpc.polkadot.io
```

## Contract API

### Messages (Functions)

#### 📝 Create Backup
```rust
create_backup(manifest_cid: String, acl_root_cid: Option<String>) -> u128
```
- Creates new backup record
- Returns backup ID
- Emits `BackupCreated` event

#### ✏️ Update Backup
```rust
update_backup(id: u128, new_manifest_cid: Option<String>, new_acl_root_cid: Option<String>) -> bool
```
- Updates manifest or ACL CID
- Only owner can update
- Returns `true` on success

#### 🗑️ Delete Backup
```rust
delete_backup(id: u128) -> bool
```
- Soft-deletes backup (marks inactive)
- Only owner can delete
- Returns `true` on success

#### 👥 Share Backup
```rust
share_backup(id: u128, recipient: AccountId, enc_key_cid: String) -> bool
```
- Shares backup with recipient
- `enc_key_cid` points to encrypted key on IPFS
- Only owner can share

#### 🚫 Revoke Share
```rust
revoke_share(id: u128, recipient: AccountId) -> bool
```
- Revokes recipient's access
- Only owner can revoke
- Returns `true` on success

#### 🔍 Query Functions

```rust
// Get backup by ID
get_backup(id: u128) -> Option<BackupRecord>

// Get all backup IDs owned by account
get_backups_by_owner(owner: AccountId) -> Vec<u128>

// Get shared key CID for recipient
get_shared_key_cid(id: u128, recipient: AccountId) -> String

// Check if account is owner
is_owner(id: u128, addr: AccountId) -> bool
```

### Events

```rust
BackupCreated { id: u128, owner: AccountId, manifest_cid: String }
BackupUpdated { id: u128, manifest_cid: String, acl_root_cid: Option<String> }
BackupDeleted { id: u128 }
BackupShared { id: u128, recipient: AccountId, enc_key_cid: String }
ShareRevoked { id: u128, recipient: AccountId }
```

## Frontend Integration

### 1. Install Dependencies

```bash
npm install @polkadot/api @polkadot/api-contract @polkadot/extension-dapp
```

### 2. Connect to Contract

```typescript
import { ApiPromise, WsProvider } from '@polkadot/api';
import { ContractPromise } from '@polkadot/api-contract';
import metadata from './backup_registry.json';

// Connect to chain
const wsProvider = new WsProvider('wss://canvas-rpc.parity.io');
const api = await ApiPromise.create({ provider: wsProvider });

// Load contract
const contractAddress = 'YOUR_CONTRACT_ADDRESS';
const contract = new ContractPromise(api, metadata, contractAddress);
```

### 3. Create Backup

```typescript
// Upload file to IPFS first
const manifestCID = await uploadToIPFS(manifest);

// Call contract
const { gasRequired, storageDeposit, result } = await contract.query.createBackup(
  userAddress,
  { gasLimit: -1 },
  manifestCID,
  null
);

// Execute transaction
const tx = contract.tx.createBackup(
  { gasLimit: gasRequired },
  manifestCID,
  null
);

await tx.signAndSend(userAccount, (result) => {
  if (result.status.isInBlock) {
    console.log('Backup created in block:', result.status.asInBlock.toHex());
  }
});
```

### 4. Query Backups

```typescript
// Get user's backups
const { output } = await contract.query.getBackupsByOwner(
  userAddress,
  { gasLimit: -1 },
  userAddress
);

const backupIds = output.toJSON();

// Get backup details
for (const id of backupIds) {
  const { output } = await contract.query.getBackup(
    userAddress,
    { gasLimit: -1 },
    id
  );
  
  const backup = output.toJSON();
  console.log('Backup:', backup);
}
```

### 5. Share Backup

```typescript
// Encrypt key for recipient
const encryptedKey = await encryptForRecipient(fileKey, recipientPublicKey);
const encKeyCID = await uploadToIPFS(encryptedKey);

// Share on-chain
const tx = contract.tx.shareBackup(
  { gasLimit: gasRequired },
  backupId,
  recipientAddress,
  encKeyCID
);

await tx.signAndSend(userAccount);
```

## Security Considerations

### ✅ What the Contract DOES Store

- ✅ IPFS CIDs (public content identifiers)
- ✅ Account addresses (public keys)
- ✅ Timestamps
- ✅ Ownership relationships

### ❌ What the Contract NEVER Stores

- ❌ Private keys
- ❌ Decryption keys
- ❌ Plaintext file data
- ❌ Unencrypted metadata

### 🔐 Security Best Practices

1. **Client-Side Encryption**: Always encrypt files in the browser before upload
2. **Key Derivation**: Derive encryption keys from user's wallet signature
3. **Recipient Encryption**: Encrypt shared keys with recipient's public key
4. **Zero-Knowledge**: Contract has zero knowledge of actual data
5. **Access Control**: Only owners can update/share/delete their backups

## Gas Optimization

### Estimated Gas Costs

| Operation | Gas (approximate) |
|-----------|------------------|
| `create_backup` | ~100,000 |
| `update_backup` | ~50,000 |
| `delete_backup` | ~50,000 |
| `share_backup` | ~75,000 |
| `revoke_share` | ~50,000 |
| Queries (read-only) | Free |

### Optimization Tips

1. **Batch Operations**: Group multiple shares in frontend, call contract once per backup
2. **Use Events**: Index events off-chain instead of querying on-chain
3. **Lazy Loading**: Query backups on-demand, not all at once
4. **Cache Results**: Cache contract queries in frontend

## Development Workflow

### Local Testing with substrate-contracts-node

1. **Install Contracts Node**:
```bash
cargo install contracts-node
```

2. **Run Local Node**:
```bash
substrate-contracts-node --dev
```

3. **Deploy Contract**:
```bash
cargo contract instantiate \
  --constructor new \
  --suri //Alice \
  --url ws://127.0.0.1:9944
```

4. **Test in Frontend**:
```typescript
const wsProvider = new WsProvider('ws://127.0.0.1:9944');
```

## Troubleshooting

### Build Errors

**Error**: `failed to compile`
```bash
# Update Rust
rustup update stable

# Clean build
cargo clean
cargo contract build
```

**Error**: `wasm32-unknown-unknown not installed`
```bash
rustup target add wasm32-unknown-unknown
```

### Deployment Errors

**Error**: `InsufficientBalance`
- Ensure account has enough tokens for gas + storage deposit

**Error**: `ContractReverted`
- Check constructor parameters
- Verify contract is built in release mode

### Runtime Errors

**Error**: `Module not found`
- Ensure contracts pallet is enabled on target chain
- Use Canvas, Westend Contracts, or Astar

## Resources

- **ink! Documentation**: https://use.ink/
- **Substrate Contracts**: https://docs.substrate.io/tutorials/smart-contracts/
- **Contracts UI**: https://contracts-ui.substrate.io/
- **Canvas Testnet**: https://canvas.polkadot.network/
- **Polkadot.js API**: https://polkadot.js.org/docs/api-contract/

## Next Steps

1. ✅ Build contract: `cargo contract build --release`
2. ✅ Deploy to Canvas testnet
3. ✅ Note contract address
4. ✅ Update frontend with contract address
5. ✅ Test create/share/query flows
6. ✅ Monitor events for indexing

## Support

For contract questions:
- Check ink! documentation
- Join Polkadot Discord: https://discord.gg/polkadot
- Substrate Stack Exchange: https://substrate.stackexchange.com/
