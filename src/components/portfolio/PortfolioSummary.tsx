import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Vault, TrendingUp } from "lucide-react";
import { PortfolioSummary as PortfolioSummaryType } from "@/types";

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
  isConnected: boolean;
}

export function PortfolioSummary({ summary, isConnected }: PortfolioSummaryProps) {
  if (!isConnected) {
    return (
      <Card className="border-border/50 bg-gradient-to-br from-card to-secondary/50">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <TrendingUp className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">
            Connect your wallets to view portfolio
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 bg-gradient-to-br from-card via-card to-primary/5 overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total USDCx Value</p>
            <p className="text-4xl font-bold gradient-text">
              ${summary.totalValueUsd.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
            <p className="text-sm text-muted-foreground">
              Across wallet and vault strategies on Stacks
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge
              variant="outline"
              className="flex items-center gap-2 border-border bg-secondary/50 px-3 py-2"
            >
              <Wallet className="h-4 w-4 text-primary" />
              <span>
                Wallet:{" "}
                <strong className="text-foreground">
                  ${summary.walletValueUsd.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </span>
            </Badge>
            <Badge
              variant="outline"
              className="flex items-center gap-2 border-border bg-secondary/50 px-3 py-2"
            >
              <Vault className="h-4 w-4 text-accent" />
              <span>
                Vault:{" "}
                <strong className="text-foreground">
                  ${summary.vaultValueUsd.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </strong>
              </span>
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
