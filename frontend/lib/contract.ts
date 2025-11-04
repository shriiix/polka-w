// TypeScript wrapper for backup_registry contract
// Provides type-safe interface for frontend integration

import { ApiPromise } from '@polkadot/api'
import { ContractPromise } from '@polkadot/api-contract'
import type { WeightV2 } from '@polkadot/types/interfaces'
import type { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'

export interface BackupRecord {
  id: string
  owner: string
  manifestCid: string
  aclRootCid: string | null
  active: boolean
  createdAt: number
  updatedAt: number
}

export interface ContractConfig {
  contractAddress: string
  api: ApiPromise
  metadata: any // Contract metadata JSON
}

export class BackupRegistryContract {
  private contract: ContractPromise
  private api: ApiPromise

  constructor(config: ContractConfig) {
    this.api = config.api
    this.contract = new ContractPromise(
      config.api,
      config.metadata,
      config.contractAddress
    )
  }

  /**
   * Create a new backup record on-chain
   */
  async createBackup(
    account: InjectedAccountWithMeta,
    manifestCid: string,
    aclRootCid?: string
  ): Promise<string> {
    // Query first to estimate gas
    const { gasRequired } = await this.contract.query.createBackup(
      account.address,
      { gasLimit: this.api.registry.createType('WeightV2', {
        refTime: BigInt(10_000_000_000),
        proofSize: BigInt(1_000_000),
      }) as WeightV2 },
      manifestCid,
      aclRootCid || null
    )

    // Execute transaction
    return new Promise((resolve, reject) => {
      this.contract.tx
        .createBackup(
          { gasLimit: gasRequired },
          manifestCid,
          aclRootCid || null
        )
        .signAndSend(account.address, (result) => {
          if (result.status.isInBlock) {
            console.log('Backup created in block:', result.status.asInBlock.toHex())
          } else if (result.status.isFinalized) {
            // Extract backup ID from events
            const backupId = this.extractBackupIdFromEvents(result.events)
            resolve(backupId)
          } else if (result.isError) {
            reject(new Error('Transaction failed'))
          }
        })
        .catch(reject)
    })
  }

  /**
   * Update an existing backup's manifest or ACL CID
   */
  async updateBackup(
    account: InjectedAccountWithMeta,
    backupId: string,
    newManifestCid?: string,
    newAclRootCid?: string
  ): Promise<boolean> {
    const { gasRequired } = await this.contract.query.updateBackup(
      account.address,
      { gasLimit: this.api.registry.createType('WeightV2', {
        refTime: BigInt(10_000_000_000),
        proofSize: BigInt(1_000_000),
      }) as WeightV2 },
      backupId,
      newManifestCid || null,
      newAclRootCid || null
    )

    return new Promise((resolve, reject) => {
      this.contract.tx
        .updateBackup(
          { gasLimit: gasRequired },
          backupId,
          newManifestCid || null,
          newAclRootCid || null
        )
        .signAndSend(account.address, (result) => {
          if (result.status.isFinalized) {
            resolve(true)
          } else if (result.isError) {
            reject(new Error('Transaction failed'))
          }
        })
        .catch(reject)
    })
  }

  /**
   * Soft-delete a backup (mark as inactive)
   */
  async deleteBackup(
    account: InjectedAccountWithMeta,
    backupId: string
  ): Promise<boolean> {
    const { gasRequired } = await this.contract.query.deleteBackup(
      account.address,
      { gasLimit: this.api.registry.createType('WeightV2', {
        refTime: BigInt(10_000_000_000),
        proofSize: BigInt(1_000_000),
      }) as WeightV2 },
      backupId
    )

    return new Promise((resolve, reject) => {
      this.contract.tx
        .deleteBackup({ gasLimit: gasRequired }, backupId)
        .signAndSend(account.address, (result) => {
          if (result.status.isFinalized) {
            resolve(true)
          } else if (result.isError) {
            reject(new Error('Transaction failed'))
          }
        })
        .catch(reject)
    })
  }

  /**
   * Share a backup with another user
   */
  async shareBackup(
    account: InjectedAccountWithMeta,
    backupId: string,
    recipientAddress: string,
    encKeyC id: string
  ): Promise<boolean> {
    const { gasRequired } = await this.contract.query.shareBackup(
      account.address,
      { gasLimit: this.api.registry.createType('WeightV2', {
        refTime: BigInt(10_000_000_000),
        proofSize: BigInt(1_000_000),
      }) as WeightV2 },
      backupId,
      recipientAddress,
      encKeyCid
    )

    return new Promise((resolve, reject) => {
      this.contract.tx
        .shareBackup(
          { gasLimit: gasRequired },
          backupId,
          recipientAddress,
          encKeyCid
        )
        .signAndSend(account.address, (result) => {
          if (result.status.isFinalized) {
            resolve(true)
          } else if (result.isError) {
            reject(new Error('Transaction failed'))
          }
        })
        .catch(reject)
    })
  }

  /**
   * Revoke a user's access to a backup
   */
  async revokeShare(
    account: InjectedAccountWithMeta,
    backupId: string,
    recipientAddress: string
  ): Promise<boolean> {
    const { gasRequired } = await this.contract.query.revokeShare(
      account.address,
      { gasLimit: this.api.registry.createType('WeightV2', {
        refTime: BigInt(10_000_000_000),
        proofSize: BigInt(1_000_000),
      }) as WeightV2 },
      backupId,
      recipientAddress
    )

    return new Promise((resolve, reject) => {
      this.contract.tx
        .revokeShare({ gasLimit: gasRequired }, backupId, recipientAddress)
        .signAndSend(account.address, (result) => {
          if (result.status.isFinalized) {
            resolve(true)
          } else if (result.isError) {
            reject(new Error('Transaction failed'))
          }
        })
        .catch(reject)
    })
  }

  /**
   * Query: Get backup record by ID
   */
  async getBackup(backupId: string, callerAddress: string): Promise<BackupRecord | null> {
    const { output } = await this.contract.query.getBackup(
      callerAddress,
      { gasLimit: this.api.registry.createType('WeightV2', {
        refTime: BigInt(10_000_000_000),
        proofSize: BigInt(1_000_000),
      }) as WeightV2 },
      backupId
    )

    if (!output) return null

    const result = output.toJSON() as any
    if (!result || result.ok === null) return null

    return this.parseBackupRecord(result.ok)
  }

  /**
   * Query: Get all backup IDs owned by an account
   */
  async getBackupsByOwner(ownerAddress: string): Promise<string[]> {
    const { output } = await this.contract.query.getBackupsByOwner(
      ownerAddress,
      { gasLimit: this.api.registry.createType('WeightV2', {
        refTime: BigInt(10_000_000_000),
        proofSize: BigInt(1_000_000),
      }) as WeightV2 },
      ownerAddress
    )

    if (!output) return []

    const result = output.toJSON() as any
    return result.ok || []
  }

  /**
   * Query: Get encrypted key CID for a shared backup
   */
  async getSharedKeyCid(
    backupId: string,
    recipientAddress: string,
    callerAddress: string
  ): Promise<string> {
    const { output } = await this.contract.query.getSharedKeyCid(
      callerAddress,
      { gasLimit: this.api.registry.createType('WeightV2', {
        refTime: BigInt(10_000_000_000),
        proofSize: BigInt(1_000_000),
      }) as WeightV2 },
      backupId,
      recipientAddress
    )

    if (!output) return ''

    const result = output.toJSON() as any
    return result.ok || ''
  }

  /**
   * Query: Check if an address is the owner of a backup
   */
  async isOwner(
    backupId: string,
    address: string,
    callerAddress: string
  ): Promise<boolean> {
    const { output } = await this.contract.query.isOwner(
      callerAddress,
      { gasLimit: this.api.registry.createType('WeightV2', {
        refTime: BigInt(10_000_000_000),
        proofSize: BigInt(1_000_000),
      }) as WeightV2 },
      backupId,
      address
    )

    if (!output) return false

    const result = output.toJSON() as any
    return result.ok || false
  }

  /**
   * Subscribe to contract events
   */
  async subscribeToEvents(
    callback: (event: any) => void
  ): Promise<() => void> {
    const unsub = await this.api.query.system.events((events) => {
      events.forEach((record) => {
        const { event } = record
        
        if (this.api.events.contracts.ContractEmitted.is(event)) {
          const [contractAddress, data] = event.data
          
          if (contractAddress.toString() === this.contract.address.toString()) {
            // Decode and forward the event
            callback({ data: data.toHuman() })
          }
        }
      })
    })

    return unsub
  }

  // Helper methods

  private extractBackupIdFromEvents(events: any[]): string {
    // Parse events to extract backup ID from BackupCreated event
    for (const record of events) {
      const { event } = record
      if (event.section === 'contracts' && event.method === 'ContractEmitted') {
        // Decode contract event data
        // This is simplified - actual implementation needs proper ABI decoding
        return '1' // Placeholder
      }
    }
    return '0'
  }

  private parseBackupRecord(data: any): BackupRecord {
    return {
      id: data.id?.toString() || '0',
      owner: data.owner || '',
      manifestCid: data.manifestCid || data.manifest_cid || '',
      aclRootCid: data.aclRootCid || data.acl_root_cid || null,
      active: data.active || false,
      createdAt: parseInt(data.createdAt || data.created_at || '0'),
      updatedAt: parseInt(data.updatedAt || data.updated_at || '0'),
    }
  }
}

// Helper function to initialize contract instance
export async function initBackupContract(
  api: ApiPromise,
  contractAddress: string,
  metadata: any
): Promise<BackupRegistryContract> {
  return new BackupRegistryContract({
    api,
    contractAddress,
    metadata,
  })
}

// Export types
export type { InjectedAccountWithMeta }
