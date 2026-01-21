import { useMemo, useState, useCallback } from "react";
import { PortfolioSummary, WalletBalanceRow, VaultPosition } from "@/types";

// Mock portfolio hook - ready for real integration
export function usePortfolio(isConnected: boolean) {
  const [isLoading, setIsLoading] = useState(false);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Mock wallet balances
  const walletBalances: WalletBalanceRow[] = useMemo(() => {
    if (!isConnected) return [];
    return [
      { asset: "USDC", chain: "Ethereum", balance: 1250.75, valueUsd: 1250.75 },
      { asset: "USDCx", chain: "Stacks", balance: 850.25, valueUsd: 850.25 },
    ];
  }, [isConnected]);

  // Mock vault position
  const vaultPosition: VaultPosition | null = useMemo(() => {
    if (!isConnected) return null;
    return {
      vaultName: "USDCx Savings Vault",
      shares: 485.5,
      underlyingUsdcx: 500.25,
      sharePrice: 1.0304,
      status: "active",
    };
  }, [isConnected]);

  // Calculate portfolio summary
  const summary: PortfolioSummary = useMemo(() => {
    const walletValue = walletBalances.reduce((sum, row) => sum + row.valueUsd, 0);
    const vaultValue = vaultPosition?.underlyingUsdcx ?? 0;
    return {
      totalValueUsd: walletValue + vaultValue,
      walletValueUsd: walletValue,
      vaultValueUsd: vaultValue,
    };
  }, [walletBalances, vaultPosition]);

  const withdraw = useCallback(async (shares: number) => {
    setIsWithdrawing(true);
    // Simulate withdrawal
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsWithdrawing(false);
  }, []);

  return {
    isLoading,
    walletBalances,
    vaultPosition,
    summary,
    withdraw,
    isWithdrawing,
  };
}
