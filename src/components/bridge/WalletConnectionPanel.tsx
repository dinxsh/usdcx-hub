import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Layers, Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { EthereumWallet, StacksWallet } from "@/types";
import { formatAddress } from "@/hooks/useWallets";

interface WalletConnectionPanelProps {
  ethereumWallet: EthereumWallet;
  stacksWallet: StacksWallet;
  onConnectEthereum: () => void;
  onConnectStacks: () => void;
}

export function WalletConnectionPanel({
  ethereumWallet,
  stacksWallet,
  onConnectEthereum,
  onConnectStacks,
}: WalletConnectionPanelProps) {
  const isFullyConnected =
    ethereumWallet.status === "connected" && stacksWallet.status === "connected";

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Wallet Connection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* Ethereum Wallet */}
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                ethereumWallet.status === "connected"
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Wallet className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Ethereum Wallet</p>
              <p
                className={cn(
                  "text-xs font-mono",
                  ethereumWallet.status === "connected"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {ethereumWallet.status === "connected"
                  ? formatAddress(ethereumWallet.address)
                  : "Not connected"}
              </p>
            </div>
          </div>
          {ethereumWallet.status === "connected" ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20 text-success">
              <Check className="h-4 w-4" />
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onConnectEthereum}
              disabled={ethereumWallet.status === "connecting"}
            >
              {ethereumWallet.status === "connecting" ? "Connecting..." : "Connect"}
            </Button>
          )}
        </div>

        {/* Stacks Wallet */}
        <div className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full",
                stacksWallet.status === "connected"
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              <Layers className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium">Stacks Wallet</p>
              <p
                className={cn(
                  "text-xs font-mono",
                  stacksWallet.status === "connected"
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                {stacksWallet.status === "connected"
                  ? formatAddress(stacksWallet.principal)
                  : "Not connected"}
              </p>
            </div>
          </div>
          {stacksWallet.status === "connected" ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20 text-success">
              <Check className="h-4 w-4" />
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onConnectStacks}
              disabled={stacksWallet.status === "connecting"}
            >
              {stacksWallet.status === "connecting" ? "Connecting..." : "Connect"}
            </Button>
          )}
        </div>

        {/* Warning if not fully connected */}
        {!isFullyConnected && (
          <div className="flex items-center gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3">
            <AlertCircle className="h-4 w-4 text-warning" />
            <p className="text-xs text-warning">
              Connect both wallets to start bridging.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
