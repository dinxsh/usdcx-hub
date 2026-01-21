import { STACKS_MAINNET, STACKS_TESTNET } from "@stacks/network";

// Stacks network configuration
export const STACKS_NETWORK = STACKS_MAINNET;
export const STACKS_TESTNET_NETWORK = STACKS_TESTNET;

// Use mainnet for production
export const activeStacksNetwork = STACKS_NETWORK;

// USDCx contract addresses on Stacks
export const USDCX_CONTRACT = {
  mainnet: {
    address: "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
    name: "token-usdcx",
  },
  testnet: {
    address: "ST3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
    name: "token-usdcx",
  },
} as const;

// xReserve vault contract
export const VAULT_CONTRACT = {
  mainnet: {
    address: "SP3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
    name: "usdcx-vault",
  },
  testnet: {
    address: "ST3K8BC0PPEVCV7NZ6QSRWPQ2JE9E5B6N3PA0KBR9",
    name: "usdcx-vault",
  },
} as const;

// App metadata for wallet connection
export const STACKS_APP_DETAILS = {
  name: "USDCx Liquidity Hub",
  icon: typeof window !== "undefined" ? window.location.origin + "/favicon.ico" : "/favicon.ico",
};
