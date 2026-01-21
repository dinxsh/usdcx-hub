import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowRight,
  Loader2,
  Info,
  Wallet,
  Vault,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BridgeStatus, StrategyType, BridgeStep } from "@/types";

interface BridgeFormProps {
  isConnected: boolean;
  amount: string;
  onAmountChange: (amount: string) => void;
  strategy: StrategyType;
  onStrategyChange: (strategy: StrategyType) => void;
  usdcBalance: number;
  status: BridgeStatus;
  isLoading: boolean;
  currentStep: BridgeStep;
  errorStep?: BridgeStep;
  onApprove: () => void;
  onBridge: () => void;
  onDeposit: () => void;
  onRetry: () => void;
}

export function BridgeForm({
  isConnected,
  amount,
  onAmountChange,
  strategy,
  onStrategyChange,
  usdcBalance,
  status,
  isLoading,
  currentStep,
  errorStep,
  onApprove,
  onBridge,
  onDeposit,
  onRetry,
}: BridgeFormProps) {
  const numericAmount = parseFloat(amount) || 0;
  const estimatedUsdcx = numericAmount * 0.998; // 0.2% fee placeholder
  const estimatedFee = numericAmount * 0.002;

  const getButtonProps = () => {
    if (!isConnected) {
      return { label: "Connect Wallets First", disabled: true, onClick: () => {} };
    }

    if (numericAmount <= 0 || numericAmount > usdcBalance) {
      return { label: "Enter Valid Amount", disabled: true, onClick: () => {} };
    }

    switch (status) {
      case "idle":
      case "awaiting_approval":
        return { label: "Approve USDC", disabled: false, onClick: onApprove };
      case "approving":
        return { label: "Approving...", disabled: true, onClick: () => {} };
      case "awaiting_bridge":
        return { label: "Bridge to USDCx", disabled: false, onClick: onBridge };
      case "bridging":
      case "minting":
        return { label: "Bridging...", disabled: true, onClick: () => {} };
      case "awaiting_deposit":
        return strategy === "vault"
          ? { label: "Deposit into Strategy", disabled: false, onClick: onDeposit }
          : { label: "Complete", disabled: true, onClick: () => {} };
      case "depositing":
        return { label: "Depositing...", disabled: true, onClick: () => {} };
      case "complete":
        return { label: "Bridge Complete ✓", disabled: true, onClick: () => {} };
      default:
        return { label: "Continue", disabled: true, onClick: () => {} };
    }
  };

  const buttonProps = getButtonProps();

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <ArrowRight className="h-5 w-5 text-primary" />
          Bridge USDC to USDCx
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Network Info */}
        <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-[#627eea]/20 text-center text-xs leading-6">
              Ξ
            </div>
            <span className="text-sm">Ethereum (USDC)</span>
          </div>
          <ArrowRight className="h-4 w-4 text-primary" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-full bg-primary/20 text-center text-xs leading-6">
              S
            </div>
            <span className="text-sm">Stacks (USDCx)</span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <Label htmlFor="amount">Amount to bridge</Label>
          <div className="relative">
            <Input
              id="amount"
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              disabled={!isConnected || isLoading}
              className="pr-20 text-lg font-mono"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary/80"
              onClick={() => onAmountChange(usdcBalance.toString())}
              disabled={!isConnected || isLoading}
            >
              MAX
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            USDC Balance:{" "}
            <span className="font-mono text-foreground">
              {usdcBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </p>
        </div>

        {/* Derived Info */}
        {numericAmount > 0 && (
          <div className="space-y-2 rounded-lg border border-border/50 bg-secondary/30 p-3 text-sm animate-fade-in">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated USDCx received:</span>
              <span className="font-mono">
                {estimatedUsdcx.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated bridge time:</span>
              <span>1–3 minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Estimated fees:</span>
              <span className="font-mono">
                ~${estimatedFee.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        )}

        {/* Strategy Selector */}
        <div className="space-y-3">
          <Label>Choose destination for USDCx</Label>
          <div className="grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => onStrategyChange("wallet")}
              disabled={!isConnected || isLoading}
              className={cn(
                "flex flex-col gap-2 rounded-lg border p-4 text-left transition-all",
                strategy === "wallet"
                  ? "border-primary bg-primary/10"
                  : "border-border/50 bg-secondary/30 hover:border-border"
              )}
            >
              <div className="flex items-center gap-2">
                <Wallet
                  className={cn(
                    "h-5 w-5",
                    strategy === "wallet" ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className="font-medium">Keep in Wallet</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Bridge your USDC and hold USDCx in your Stacks wallet.
              </p>
            </button>

            <button
              type="button"
              onClick={() => onStrategyChange("vault")}
              disabled={!isConnected || isLoading}
              className={cn(
                "flex flex-col gap-2 rounded-lg border p-4 text-left transition-all",
                strategy === "vault"
                  ? "border-primary bg-primary/10"
                  : "border-border/50 bg-secondary/30 hover:border-border"
              )}
            >
              <div className="flex items-center gap-2">
                <Vault
                  className={cn(
                    "h-5 w-5",
                    strategy === "vault" ? "text-primary" : "text-muted-foreground"
                  )}
                />
                <span className="font-medium">Deposit into Vault</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Bridge and deposit into a savings vault in one flow.
              </p>
            </button>
          </div>

          {/* Vault Info */}
          {strategy === "vault" && (
            <div className="flex items-center gap-4 rounded-lg border border-primary/30 bg-primary/5 p-3 text-sm animate-fade-in">
              <Info className="h-4 w-4 text-primary" />
              <div className="flex flex-1 justify-between">
                <span>
                  Vault APY (demo): <strong className="text-primary">4.5%</strong>
                </span>
                <span>
                  TVL: <strong>$120,000</strong>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {errorStep && (
          <div className="flex items-start gap-3 rounded-lg border border-destructive/50 bg-destructive/10 p-4 animate-fade-in">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-destructive">Transaction failed</p>
              <p className="text-sm text-muted-foreground">
                Reason: Network timeout. Please try again.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="mr-1 h-3 w-3" />
              Retry
            </Button>
          </div>
        )}

        {/* CTA Button */}
        <Button
          variant={status === "complete" ? "success" : "glow"}
          size="xl"
          className="w-full"
          disabled={buttonProps.disabled || isLoading}
          onClick={buttonProps.onClick}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {buttonProps.label}
        </Button>
      </CardContent>
    </Card>
  );
}
