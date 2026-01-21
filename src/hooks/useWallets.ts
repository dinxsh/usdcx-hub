import { useState, useCallback } from "react";
import { EthereumWallet, StacksWallet, WalletStatus } from "@/types";

// Mock wallet hook - ready for real wallet integration
export function useWallets() {
  const [ethereumWallet, setEthereumWallet] = useState<EthereumWallet>({
    status: "disconnected",
    address: null,
  });

  const [stacksWallet, setStacksWallet] = useState<StacksWallet>({
    status: "disconnected",
    principal: null,
  });

  const connectEthereum = useCallback(async () => {
    setEthereumWallet({ status: "connecting", address: null });
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setEthereumWallet({
      status: "connected",
      address: "0x742d35Cc6634C0532925a3b844Bc9e7595f5aE89",
    });
  }, []);

  const disconnectEthereum = useCallback(() => {
    setEthereumWallet({ status: "disconnected", address: null });
  }, []);

  const connectStacks = useCallback(async () => {
    setStacksWallet({ status: "connecting", principal: null });
    // Simulate connection delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStacksWallet({
      status: "connected",
      principal: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    });
  }, []);

  const disconnectStacks = useCallback(() => {
    setStacksWallet({ status: "disconnected", principal: null });
  }, []);

  const isFullyConnected =
    ethereumWallet.status === "connected" && stacksWallet.status === "connected";

  return {
    ethereumWallet,
    stacksWallet,
    isFullyConnected,
    connectEthereum,
    disconnectEthereum,
    connectStacks,
    disconnectStacks,
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
