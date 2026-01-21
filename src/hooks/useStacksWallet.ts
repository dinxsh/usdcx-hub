import { useState, useCallback } from "react";
import { StacksWallet } from "@/types";

// Mock Stacks wallet hook - can be replaced with @stacks/connect later
export function useStacksWallet() {
  const [wallet, setWallet] = useState<StacksWallet>({
    status: "disconnected",
    principal: null,
  });

  const connect = useCallback(async () => {
    setWallet({ status: "connecting", principal: null });
    // Simulate connection delay - replace with real Stacks connect
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setWallet({
      status: "connected",
      principal: "SP2J6ZY48GV1EZ5V2V5RB9MP66SW86PYKKNRV9EJ7",
    });
  }, []);

  const disconnect = useCallback(() => {
    setWallet({ status: "disconnected", principal: null });
  }, []);

  return {
    wallet,
    connect,
    disconnect,
    isConnected: wallet.status === "connected",
  };
}
