import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { VaultPosition } from "@/types";

interface WithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  position: VaultPosition;
  onWithdraw: (shares: number) => Promise<void>;
  isWithdrawing: boolean;
}

export function WithdrawModal({
  open,
  onOpenChange,
  position,
  onWithdraw,
  isWithdrawing,
}: WithdrawModalProps) {
  const [shares, setShares] = useState("");

  const numericShares = parseFloat(shares) || 0;
  const estimatedUsdcx = numericShares * position.sharePrice;
  const isValid = numericShares > 0 && numericShares <= position.shares;

  const handleWithdraw = async () => {
    if (!isValid) return;
    await onWithdraw(numericShares);
    setShares("");
    onOpenChange(false);
  };

  const handleMaxClick = () => {
    setShares(position.shares.toString());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Withdraw from USDCx Savings Vault</DialogTitle>
          <DialogDescription>
            You have{" "}
            <span className="font-mono font-medium text-foreground">
              {position.shares.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>{" "}
            shares (~
            <span className="font-mono font-medium text-foreground">
              {position.underlyingUsdcx.toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}
            </span>{" "}
            USDCx)
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="withdraw-shares">Shares to withdraw</Label>
            <div className="relative">
              <Input
                id="withdraw-shares"
                type="number"
                placeholder="0.00"
                value={shares}
                onChange={(e) => setShares(e.target.value)}
                className="pr-16 font-mono"
                disabled={isWithdrawing}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-primary hover:text-primary/80"
                onClick={handleMaxClick}
                disabled={isWithdrawing}
              >
                MAX
              </Button>
            </div>
          </div>

          {numericShares > 0 && (
            <div className="rounded-lg border border-border/50 bg-secondary/30 p-3 animate-fade-in">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  You will receive ≈
                </span>
                <span className="font-mono font-medium">
                  {estimatedUsdcx.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}{" "}
                  USDCx
                </span>
              </div>
            </div>
          )}

          {numericShares > position.shares && (
            <p className="text-xs text-destructive">
              Amount exceeds available shares
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isWithdrawing}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleWithdraw}
            disabled={!isValid || isWithdrawing}
          >
            {isWithdrawing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isWithdrawing ? "Withdrawing..." : "Confirm Withdrawal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
