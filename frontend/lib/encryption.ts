export async function encryptFile(file: File, password: string): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer()
  const key = await deriveKey(password)
  const iv = crypto.getRandomValues(new Uint8Array(12))

  const encryptedData = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, arrayBuffer)

  // Combine IV and encrypted data
  const combined = new Uint8Array(iv.length + encryptedData.byteLength)
  combined.set(iv, 0)
  combined.set(new Uint8Array(encryptedData), iv.length)

  return new Blob([combined])
}

export async function decryptFile(encryptedBlob: Blob, password: string): Promise<ArrayBuffer> {
  const arrayBuffer = await encryptedBlob.arrayBuffer()
  const data = new Uint8Array(arrayBuffer)

  const iv = data.slice(0, 12)
  const encryptedData = data.slice(12)

  const key = await deriveKey(password)

  return await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encryptedData)
}

export async function generateEncryptionKey(): Promise<CryptoKey> {
  return await crypto.subtle.generateKey(
    {
      name: "AES-GCM",
      length: 256,
    },
    true,
    ["encrypt", "decrypt"],
  )
}

async function deriveKey(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder()
  const passwordData = encoder.encode(password)

  const keyMaterial = await crypto.subtle.importKey("raw", passwordData, "PBKDF2", false, ["deriveBits", "deriveKey"])

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode("web3-storage-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  )
}
