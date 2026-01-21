import { PortfolioSummary } from "@/components/portfolio/PortfolioSummary";
import { WalletBalancesCard } from "@/components/portfolio/WalletBalancesCard";
import { VaultPositionsCard } from "@/components/portfolio/VaultPositionsCard";
import { usePortfolio } from "@/hooks/usePortfolio";

interface PortfolioPageProps {
  isConnected: boolean;
}

export function PortfolioPage({ isConnected }: PortfolioPageProps) {
  const portfolio = usePortfolio(isConnected);

  return (
    <div className="container py-6 px-4 lg:py-8">
      <div className="space-y-6">
        {/* Summary Card */}
        <PortfolioSummary summary={portfolio.summary} isConnected={isConnected} />

        {/* Balances and Positions */}
        <div className="grid gap-6 md:grid-cols-2">
          <WalletBalancesCard
            balances={portfolio.walletBalances}
            isConnected={isConnected}
          />
          <VaultPositionsCard
            position={portfolio.vaultPosition}
            isConnected={isConnected}
            onWithdraw={portfolio.withdraw}
            isWithdrawing={portfolio.isWithdrawing}
          />
        </div>
      </div>
    </div>
  );
}
