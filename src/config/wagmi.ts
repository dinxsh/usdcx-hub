import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";

// RainbowKit configuration
// For production, replace with your own WalletConnect Project ID from https://cloud.walletconnect.com
const WALLETCONNECT_PROJECT_ID = "3a8170812b534d0ff9d794f19a901d64";

export const wagmiConfig = getDefaultConfig({
  appName: "USDCx Liquidity Hub",
  projectId: WALLETCONNECT_PROJECT_ID,
  chains: [mainnet, sepolia],
  ssr: false,
});

// USDC contract addresses
export const USDC_ADDRESSES = {
  [mainnet.id]: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  [sepolia.id]: "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238",
} as const;

// xReserve bridge contract addresses
export const XRESERVE_ADDRESSES = {
  [mainnet.id]: "0xbd3fa81b58ba92a82136038b25adec7066af3155",
  [sepolia.id]: "0xbd3fa81b58ba92a82136038b25adec7066af3155", // Testnet address
} as const;

// Stacks domain ID for xReserve protocol (constant across all networks)
export const STACKS_DOMAIN_ID = 10003;

// Re-export chains for use elsewhere
export { mainnet, sepolia };
