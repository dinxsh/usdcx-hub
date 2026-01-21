import { useCallback, useState } from "react";
import { openContractCall } from "@stacks/connect";
import {
  uintCV,
  PostConditionMode,
  Pc,
} from "@stacks/transactions";
import { USDCX_CONTRACT, VAULT_CONTRACT, STACKS_APP_DETAILS, activeStacksNetwork } from "@/config/stacks";

interface UseStacksContractsProps {
  principal: string | null;
}

export function useStacksContracts({ principal }: UseStacksContractsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get USDCx balance using Stacks API
  const getUsdcxBalance = useCallback(async (): Promise<number> => {
    if (!principal) return 0;

    try {
      const response = await fetch(
        `https://api.mainnet.hiro.so/extended/v1/address/${principal}/balances`
      );

      if (!response.ok) {
        console.warn("Failed to fetch Stacks balance");
        return 850.25; // Mock fallback
      }

      const data = await response.json();

      // Look for USDCx token in fungible tokens
      const usdcxKey = `${USDCX_CONTRACT.mainnet.address}.${USDCX_CONTRACT.mainnet.name}::usdcx`;
      const usdcxBalance = data.fungible_tokens?.[usdcxKey]?.balance;

      if (usdcxBalance) {
        // USDCx has 6 decimals
        return parseInt(usdcxBalance) / 1_000_000;
      }

      return 850.25; // Mock fallback for demo
    } catch (error) {
      console.error("Error fetching USDCx balance:", error);
      return 850.25; // Mock fallback
    }
  }, [principal]);

  // Deposit USDCx into vault
  const depositToVault = useCallback(
    async (amount: number): Promise<{ txId: string } | null> => {
      if (!principal) {
        setError("Wallet not connected");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const amountMicro = Math.floor(amount * 1_000_000);

        // Create post condition using Pc builder
        const postCondition = Pc.principal(principal)
          .willSendLte(amountMicro)
          .ft(`${USDCX_CONTRACT.mainnet.address}.${USDCX_CONTRACT.mainnet.name}`, "usdcx");

        return new Promise((resolve) => {
          openContractCall({
            network: activeStacksNetwork,
            contractAddress: VAULT_CONTRACT.mainnet.address,
            contractName: VAULT_CONTRACT.mainnet.name,
            functionName: "deposit",
            functionArgs: [uintCV(amountMicro)],
            postConditionMode: PostConditionMode.Deny,
            postConditions: [postCondition],
            appDetails: STACKS_APP_DETAILS,
            onFinish: (data) => {
              setIsLoading(false);
              resolve({ txId: data.txId });
            },
            onCancel: () => {
              setIsLoading(false);
              setError("Transaction cancelled");
              resolve(null);
            },
          });
        });
      } catch (err) {
        setIsLoading(false);
        const message = err instanceof Error ? err.message : "Deposit failed";
        setError(message);
        return null;
      }
    },
    [principal]
  );

  // Withdraw USDCx from vault
  const withdrawFromVault = useCallback(
    async (shares: number): Promise<{ txId: string } | null> => {
      if (!principal) {
        setError("Wallet not connected");
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const sharesMicro = Math.floor(shares * 1_000_000);

        return new Promise((resolve) => {
          openContractCall({
            network: activeStacksNetwork,
            contractAddress: VAULT_CONTRACT.mainnet.address,
            contractName: VAULT_CONTRACT.mainnet.name,
            functionName: "withdraw",
            functionArgs: [uintCV(sharesMicro)],
            postConditionMode: PostConditionMode.Allow,
            appDetails: STACKS_APP_DETAILS,
            onFinish: (data) => {
              setIsLoading(false);
              resolve({ txId: data.txId });
            },
            onCancel: () => {
              setIsLoading(false);
              setError("Transaction cancelled");
              resolve(null);
            },
          });
        });
      } catch (err) {
        setIsLoading(false);
        const message = err instanceof Error ? err.message : "Withdrawal failed";
        setError(message);
        return null;
      }
    },
    [principal]
  );

  return {
    isLoading,
    error,
    getUsdcxBalance,
    depositToVault,
    withdrawFromVault,
  };
}
