import { create } from "@web3-storage/w3up-client"

let client: Awaited<ReturnType<typeof create>> | null = null

export async function getWeb3StorageClient() {
  if (client) return client

  client = await create()
  return client
}

export async function uploadFile(file: File) {
  const client = await getWeb3StorageClient()
  const cid = await client.uploadFile(file)
  return cid.toString()
}

export async function uploadDirectory(files: File[]) {
  const client = await getWeb3StorageClient()
  const cid = await client.uploadDirectory(files)
  return cid.toString()
}

export function getIPFSUrl(cid: string) {
  return `https://w3s.link/ipfs/${cid}`
}
