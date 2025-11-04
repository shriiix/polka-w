// ink! Smart Contract: Web3 Cloud Backup Metadata Registry (MVP)
// File: lib.rs
// Purpose: Contract to register backup manifests, manage ACL pointers and encrypted key blobs,
//          allow sharing/revocation, and provide read-only queries for frontend.
// Notes: THIS CONTRACT STORES ONLY METADATA (CIDs, owners, pointers). Never store plaintext keys on-chain.

#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
pub mod backup_registry {
    use ink::prelude::{string::String, vec::Vec};
    use ink::storage::Mapping;

    /// Record stored on-chain for each backup
    #[derive(scale::Encode, scale::Decode, Clone, Debug, PartialEq, Eq)]
    #[cfg_attr(feature = "std", derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout))]
    pub struct BackupRecord {
        pub id: u128,
        pub owner: AccountId,
        pub manifest_cid: String,        // CID pointing to manifest JSON on IPFS
        pub acl_root_cid: Option<String>,// Optional CID that points to encrypted ACL/key blobs on IPFS
        pub active: bool,
        pub created_at: Timestamp,
        pub updated_at: Timestamp,
    }

    pub type Timestamp = u64;

    #[ink(event)]
    pub struct BackupCreated {
        #[ink(topic)]
        id: u128,
        #[ink(topic)]
        owner: AccountId,
        manifest_cid: String,
    }

    #[ink(event)]
    pub struct BackupUpdated {
        #[ink(topic)]
        id: u128,
        manifest_cid: String,
        acl_root_cid: Option<String>,
    }

    #[ink(event)]
    pub struct BackupDeleted {
        #[ink(topic)]
        id: u128,
    }

    #[ink(event)]
    pub struct BackupShared {
        #[ink(topic)]
        id: u128,
        #[ink(topic)]
        recipient: AccountId,
        enc_key_cid: String,
    }

    #[ink(event)]
    pub struct ShareRevoked {
        #[ink(topic)]
        id: u128,
        #[ink(topic)]
        recipient: AccountId,
    }

    #[ink(storage)]
    pub struct BackupRegistry {
        next_id: u128,
        records: Mapping<u128, BackupRecord>,
        owner_index: Mapping<AccountId, Vec<u128>>,
        // For each (backup_id, recipient) -> encrypted key CID (stored off-chain on IPFS),
        // frontend writes the CID which points to encrypted key material for that recipient.
        shared_keys: Mapping<(u128, AccountId), String>,
    }

    impl BackupRegistry {
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                next_id: 1u128,
                records: Mapping::default(),
                owner_index: Mapping::default(),
                shared_keys: Mapping::default(),
            }
        }

        /// Create a new backup record. Caller becomes owner of the backup.
        /// `manifest_cid` - CID of manifest JSON on IPFS (contains chunk CIDs and encryption metadata).
        /// `acl_root_cid` - optional CID pointing to ACL or encrypted key bundle on IPFS.
        #[ink(message)]
        pub fn create_backup(&mut self, manifest_cid: String, acl_root_cid: Option<String>) -> u128 {
            let caller = self.env().caller();
            let id = self.next_id;
            let now = self.env().block_timestamp();

            let record = BackupRecord {
                id,
                owner: caller,
                manifest_cid: manifest_cid.clone(),
                acl_root_cid: acl_root_cid.clone(),
                active: true,
                created_at: now,
                updated_at: now,
            };

            self.records.insert(id, &record);

            let mut index = self.owner_index.get(&caller).unwrap_or_default();
            index.push(id);
            self.owner_index.insert(&caller, &index);

            self.next_id = id + 1;

            self.env().emit_event(BackupCreated {
                id,
                owner: caller,
                manifest_cid,
            });

            id
        }

        /// Update manifest CID or ACL root CID. Only owner can update.
        #[ink(message)]
        pub fn update_backup(&mut self, id: u128, new_manifest_cid: Option<String>, new_acl_root_cid: Option<String>) -> bool {
            let caller = self.env().caller();
            match self.records.get(id) {
                Some(mut rec) => {
                    if rec.owner != caller {
                        return false;
                    }
                    if let Some(mcid) = new_manifest_cid {
                        rec.manifest_cid = mcid.clone();
                    }
                    if new_acl_root_cid.is_some() {
                        rec.acl_root_cid = new_acl_root_cid.clone();
                    }
                    rec.updated_at = self.env().block_timestamp();
                    self.records.insert(id, &rec);

                    self.env().emit_event(BackupUpdated {
                        id,
                        manifest_cid: rec.manifest_cid.clone(),
                        acl_root_cid: rec.acl_root_cid.clone(),
                    });
                    true
                }
                None => false,
            }
        }

        /// Soft-delete the backup (mark inactive). Only owner can delete.
        #[ink(message)]
        pub fn delete_backup(&mut self, id: u128) -> bool {
            let caller = self.env().caller();
            match self.records.get(id) {
                Some(mut rec) => {
                    if rec.owner != caller {
                        return false;
                    }
                    if !rec.active {
                        return false; // already inactive
                    }
                    rec.active = false;
                    rec.updated_at = self.env().block_timestamp();
                    self.records.insert(id, &rec);

                    self.env().emit_event(BackupDeleted { id });
                    true
                }
                None => false,
            }
        }

        /// Share a backup with `recipient`. The caller must be the owner.
        /// `enc_key_cid` is a CID pointing to encrypted key material (encrypted with recipient's public key) on IPFS.
        #[ink(message)]
        pub fn share_backup(&mut self, id: u128, recipient: AccountId, enc_key_cid: String) -> bool {
            let caller = self.env().caller();
            match self.records.get(id) {
                Some(rec) => {
                    if rec.owner != caller {
                        return false;
                    }
                    // store mapping (id, recipient) -> enc_key_cid
                    self.shared_keys.insert((id, recipient), &enc_key_cid);

                    self.env().emit_event(BackupShared { id, recipient, enc_key_cid });
                    true
                }
                None => false,
            }
        }

        /// Revoke a previously shared key for recipient. Only owner can revoke.
        #[ink(message)]
        pub fn revoke_share(&mut self, id: u128, recipient: AccountId) -> bool {
            let caller = self.env().caller();
            match self.records.get(id) {
                Some(rec) => {
                    if rec.owner != caller {
                        return false;
                    }
                    // remove mapping by inserting empty string or deleting - Mapping has no remove API in some versions,
                    // so we overwrite with empty string to indicate revoked.
                    self.shared_keys.insert((id, recipient), &String::from(""));
                    self.env().emit_event(ShareRevoked { id, recipient });
                    true
                }
                None => false,
            }
        }

        /// Read-only: get backup record by id
        #[ink(message)]
        pub fn get_backup(&self, id: u128) -> Option<BackupRecord> {
            self.records.get(id)
        }

        /// Read-only: get backup IDs owned by an account
        #[ink(message)]
        pub fn get_backups_by_owner(&self, owner: AccountId) -> Vec<u128> {
            self.owner_index.get(&owner).unwrap_or_default()
        }

        /// Read-only: get encrypted key CID for a (backup_id, recipient) pair.
        /// Returns empty string if none or revoked.
        #[ink(message)]
        pub fn get_shared_key_cid(&self, id: u128, recipient: AccountId) -> String {
            self.shared_keys.get((id, recipient)).unwrap_or_default()
        }

        /// Helper: check whether caller is owner of a backup
        #[ink(message)]
        pub fn is_owner(&self, id: u128, addr: AccountId) -> bool {
            match self.records.get(id) {
                Some(rec) => rec.owner == addr,
                None => false,
            }
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn new_works() {
            let contract = BackupRegistry::new();
            assert_eq!(contract.next_id, 1);
        }

        #[ink::test]
        fn create_backup_works() {
            let mut contract = BackupRegistry::new();
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            
            let id = contract.create_backup(
                String::from("QmTest123"),
                Some(String::from("QmACL456"))
            );
            
            assert_eq!(id, 1);
            
            let record = contract.get_backup(id);
            assert!(record.is_some());
            assert_eq!(record.unwrap().owner, accounts.alice);
        }

        #[ink::test]
        fn update_backup_works() {
            let mut contract = BackupRegistry::new();
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            
            let id = contract.create_backup(String::from("QmTest123"), None);
            let result = contract.update_backup(
                id,
                Some(String::from("QmNewTest456")),
                Some(String::from("QmNewACL789"))
            );
            
            assert!(result);
            
            let record = contract.get_backup(id).unwrap();
            assert_eq!(record.manifest_cid, "QmNewTest456");
        }

        #[ink::test]
        fn share_and_revoke_works() {
            let mut contract = BackupRegistry::new();
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            
            let id = contract.create_backup(String::from("QmTest123"), None);
            
            // Share with Bob
            let share_result = contract.share_backup(
                id,
                accounts.bob,
                String::from("QmEncryptedKey123")
            );
            assert!(share_result);
            
            // Check Bob can see the shared key
            let key_cid = contract.get_shared_key_cid(id, accounts.bob);
            assert_eq!(key_cid, "QmEncryptedKey123");
            
            // Revoke Bob's access
            let revoke_result = contract.revoke_share(id, accounts.bob);
            assert!(revoke_result);
            
            // Check Bob's key is now empty
            let key_cid = contract.get_shared_key_cid(id, accounts.bob);
            assert_eq!(key_cid, "");
        }

        #[ink::test]
        fn delete_backup_works() {
            let mut contract = BackupRegistry::new();
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            
            let id = contract.create_backup(String::from("QmTest123"), None);
            let result = contract.delete_backup(id);
            
            assert!(result);
            
            let record = contract.get_backup(id).unwrap();
            assert!(!record.active);
        }

        #[ink::test]
        fn unauthorized_update_fails() {
            let mut contract = BackupRegistry::new();
            let accounts = ink::env::test::default_accounts::<ink::env::DefaultEnvironment>();
            
            // Alice creates backup
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.alice);
            let id = contract.create_backup(String::from("QmTest123"), None);
            
            // Bob tries to update Alice's backup
            ink::env::test::set_caller::<ink::env::DefaultEnvironment>(accounts.bob);
            let result = contract.update_backup(id, Some(String::from("QmHacked")), None);
            
            assert!(!result);
        }
    }
}

/*
Deployment & Frontend Integration Notes (include in README):

1) Build & deploy
   - Use `cargo contract` (from cargo-contract) to build the contract WASM and metadata.
   - Deploy to a Contracts-enabled chain (Canvas, Westend with contracts pallet, or local dev node).

2) Frontend flow (example):
   - Upload file chunks to IPFS (web3.storage / ipfs-http-client).
   - Create manifest JSON with chunk CIDs and encryption metadata; upload manifest to IPFS -> get `manifestCID`.
   - Optionally create ACL bundle (encrypted key blobs) and upload -> get `aclRootCID`.
   - Call `create_backup(manifestCID, Some(aclRootCID))` via contract; user signs tx with Polkadot.js extension.
   - To share with a recipient: encrypt file key locally with recipient's public key, upload encrypted key blob to IPFS -> get `encKeyCID`.
     Then call `share_backup(backupId, recipientAccountId, encKeyCID)` on-chain.
   - Recipient calls `get_shared_key_cid(backupId, recipient)` to fetch CID, downloads encrypted key blob from IPFS, decrypts locally and then downloads chunk CIDs from manifest to restore file.

3) Security
   - Never store private keys or plaintext decryption keys on-chain or in any public storage.
   - The contract stores only pointers (CIDs). Encrypted key blobs must be created client-side and encrypted for specific recipients.

4) Gas & Fees
   - Contract calls consume gas. Prefer batching off-chain where possible and only write essential pointers on-chain.

5) Limitations
   - Revocation cannot prevent a recipient who already downloaded and decrypted the file from retaining it. Revocation only prevents future automated access via stored encrypted key blobs.
*/
