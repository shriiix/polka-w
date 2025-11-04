#![cfg_attr(not(feature = "std"), no_std, no_main)]

#[ink::contract]
mod chainvault {
    use ink::prelude::vec::Vec;
    use ink::storage::Mapping;

    /// Represents a single backup entry
    #[derive(scale::Decode, scale::Encode, Clone, Debug, PartialEq)]
    #[cfg_attr(
        feature = "std",
        derive(scale_info::TypeInfo, ink::storage::traits::StorageLayout)
    )]
    pub struct BackupEntry {
        pub backup_id: u64,
        pub owner: AccountId,
        pub data_hash: [u8; 32],
        pub timestamp: Timestamp,
    }

    /// Contract storage
    #[ink(storage)]
    pub struct ChainVault {
        /// Maps backup_id => BackupEntry
        backups: Mapping<u64, BackupEntry>,
        /// Total number of backups created
        backup_count: u64,
        /// Contract owner
        admin: AccountId,
    }

    /// Events
    #[ink(event)]
    pub struct BackupCreated {
        #[ink(topic)]
        backup_id: u64,
        #[ink(topic)]
        owner: AccountId,
        data_hash: [u8; 32],
    }

    impl ChainVault {
        /// Constructor
        #[ink(constructor)]
        pub fn new() -> Self {
            Self {
                backups: Mapping::default(),
                backup_count: 0,
                admin: Self::env().caller(),
            }
        }

        /// Create a new backup entry
        #[ink(message)]
        pub fn create_backup(&mut self, data_hash: [u8; 32]) -> u64 {
            let caller = self.env().caller();
            let timestamp = self.env().block_timestamp();
            
            self.backup_count = self.backup_count.saturating_add(1);
            let backup_id = self.backup_count;

            let entry = BackupEntry {
                backup_id,
                owner: caller,
                data_hash,
                timestamp,
            };

            self.backups.insert(backup_id, &entry);

            self.env().emit_event(BackupCreated {
                backup_id,
                owner: caller,
                data_hash,
            });

            backup_id
        }

        /// Get backup by ID
        #[ink(message)]
        pub fn get_backup(&self, backup_id: u64) -> Option<BackupEntry> {
            self.backups.get(backup_id)
        }

        /// Get all backups for caller
        #[ink(message)]
        pub fn get_my_backups(&self) -> Vec<BackupEntry> {
            let caller = self.env().caller();
            let mut result = Vec::new();

            for id in 1..=self.backup_count {
                if let Some(entry) = self.backups.get(id) {
                    if entry.owner == caller {
                        result.push(entry);
                    }
                }
            }
            result
        }

        /// Verify hash exists
        #[ink(message)]
        pub fn verify_hash(&self, data_hash: [u8; 32]) -> bool {
            for id in 1..=self.backup_count {
                if let Some(entry) = self.backups.get(id) {
                    if entry.data_hash == data_hash {
                        return true;
                    }
                }
            }
            false
        }

        /// Get total backups
        #[ink(message)]
        pub fn total_backups(&self) -> u64 {
            self.backup_count
        }

        /// Get admin
        #[ink(message)]
        pub fn get_admin(&self) -> AccountId {
            self.admin
        }
    }

    #[cfg(test)]
    mod tests {
        use super::*;

        #[ink::test]
        fn new_works() {
            let contract = ChainVault::new();
            assert_eq!(contract.total_backups(), 0);
        }

        #[ink::test]
        fn create_backup_works() {
            let mut contract = ChainVault::new();
            let hash = [1u8; 32];
            let id = contract.create_backup(hash);
            assert_eq!(id, 1);
            assert_eq!(contract.total_backups(), 1);
        }

        #[ink::test]
        fn get_backup_works() {
            let mut contract = ChainVault::new();
            let hash = [2u8; 32];
            let id = contract.create_backup(hash);
            let retrieved = contract.get_backup(id).unwrap();
            assert_eq!(retrieved.data_hash, hash);
        }

        #[ink::test]
        fn verify_hash_works() {
            let mut contract = ChainVault::new();
            let hash = [3u8; 32];
            contract.create_backup(hash);
            assert!(contract.verify_hash(hash));
            assert!(!contract.verify_hash([4u8; 32]));
        }
    }
}
