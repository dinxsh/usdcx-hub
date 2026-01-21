import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Vault, ArrowRight, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import { VaultPosition } from "@/types";
import { WithdrawModal } from "./WithdrawModal";

interface VaultPositionsCardProps {
  position: VaultPosition | null;
  isConnected: boolean;
  onWithdraw: (shares: number) => Promise<void>;
  isWithdrawing: boolean;
}

export function VaultPositionsCard({
  position,
  isConnected,
  onWithdraw,
  isWithdrawing,
}: VaultPositionsCardProps) {
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

  if (!isConnected) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Vault className="h-4 w-4 text-accent" />
            USDCx Vault Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Vault className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Connect your wallets to view positions
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!position) {
    return (
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Vault className="h-4 w-4 text-accent" />
            USDCx Vault Positions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Vault className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground mb-3">
              You don't have an active vault position
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-1 text-sm text-primary hover:text-primary/80"
            >
              Go to Bridge & Deposit to start earning
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-border/50 bg-card/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Vault className="h-4 w-4 text-accent" />
            USDCx Vault Positions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border/50 bg-secondary/30 p-4 space-y-4">
            {/* Vault Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                  <Vault className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">{position.vaultName}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-success" />
                    <span>APY: 4.5%</span>
                  </div>
                </div>
              </div>
              <Badge
                variant="outline"
                className="border-success/50 bg-success/10 text-success"
              >
                Active
              </Badge>
            </div>

            {/* Position Details */}
            <div className="grid gap-3 text-sm">
              <div className="flex justify-between rounded-md bg-background/50 p-2">
                <span className="text-muted-foreground">Shares</span>
                <span className="font-mono">
                  {position.shares.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between rounded-md bg-background/50 p-2">
                <span className="text-muted-foreground">Underlying USDCx</span>
                <span className="font-mono">
                  {position.underlyingUsdcx.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between rounded-md bg-background/50 p-2">
                <span className="text-muted-foreground">Share Price</span>
                <span className="font-mono">
                  {position.sharePrice.toFixed(4)} USDCx
                </span>
              </div>
            </div>

            {/* Withdraw Button */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setWithdrawModalOpen(true)}
            >
              Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      <WithdrawModal
        open={withdrawModalOpen}
        onOpenChange={setWithdrawModalOpen}
        position={position}
        onWithdraw={onWithdraw}
        isWithdrawing={isWithdrawing}
      />
    </>
  );
}
