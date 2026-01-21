import { useAccount, useDisconnect, useReadContract } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { formatUnits } from "viem";
import { USDC_ADDRESSES, mainnet } from "@/config/wagmi";
import { EthereumWallet } from "@/types";

// USDC ABI for balanceOf
const USDC_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useEthereumWallet() {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();

  // Get USDC balance using contract read
  const { data: usdcBalanceRaw } = useReadContract({
    address: USDC_ADDRESSES[mainnet.id],
    abi: USDC_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
    },
  });

  const wallet: EthereumWallet = {
    status: isConnecting ? "connecting" : isConnected ? "connected" : "disconnected",
    address: address ?? null,
  };

  const connect = () => {
    if (openConnectModal) {
      openConnectModal();
    }
  };

  // USDC has 6 decimals
  const usdcBalance = usdcBalanceRaw ? parseFloat(formatUnits(usdcBalanceRaw, 6)) : 0;

  return {
    wallet,
    connect,
    disconnect,
    usdcBalance,
    isConnected,
  };
}

// Format address for display
export function formatAddress(address: string | null, chars = 4): string {
  if (!address) return "";
  if (address.startsWith("0x")) {
    return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
  }
  // Stacks principal
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}
