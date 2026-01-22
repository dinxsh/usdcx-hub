import { createAddress, AddressVersion, StacksWireType, addressToString } from "@stacks/transactions";
import { type Hex, pad, toHex } from "viem";

/**
 * Encodes a Stacks address into a bytes32 format for xReserve bridge
 * The format is: 11 bytes padding + 1 byte version + 20 bytes hash160
 */
export function encodeStacksAddressForBridge(stacksAddress: string): Hex {
  const address = createAddress(stacksAddress);
  
  // Create the 32-byte buffer
  const buffer = new Uint8Array(32);
  
  // First 11 bytes are zero padding (already zeros)
  // Byte 11 is the version byte
  buffer[11] = address.version;
  
  // Bytes 12-31 are the hash160 (20 bytes)
  const hashBytes = hexToBytes(address.hash160);
  buffer.set(hashBytes, 12);
  
  return toHex(buffer);
}

/**
 * Decodes a bytes32 remote recipient back to a Stacks address
 */
export function decodeStacksAddressFromBridge(bytes32: Hex): string {
  const bytes = hexToBytes(bytes32.slice(2)); // Remove 0x prefix
  
  // Extract version byte from position 11
  const version = bytes[11] as AddressVersion;
  
  // Extract hash160 from positions 12-31
  const hash160Bytes = bytes.slice(12, 32);
  const hash160 = bytesToHex(hash160Bytes);
  
  return addressToString({
    hash160,
    version,
    type: StacksWireType.Address,
  });
}

// Helper to convert hex string to bytes
function hexToBytes(hex: string): Uint8Array {
  const cleanHex = hex.startsWith("0x") ? hex.slice(2) : hex;
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
  }
  return bytes;
}

// Helper to convert bytes to hex string
function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
