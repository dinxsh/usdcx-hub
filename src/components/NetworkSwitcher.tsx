import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { mainnet, sepolia } from "@/config/wagmi";

const SUPPORTED_CHAIN_IDS: readonly number[] = [mainnet.id, sepolia.id];

export function NetworkSwitcher() {
  const { isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChain, isPending, error } = useSwitchChain();

  // Only show if connected and on wrong network
  const isWrongNetwork = isConnected && chainId && !SUPPORTED_CHAIN_IDS.includes(chainId);

  if (!isWrongNetwork) {
    return null;
  }

  return (
    <div className="border-b border-destructive/30 bg-destructive/10 px-4 py-3">
      <div className="container flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 shrink-0 text-destructive" />
          <div>
            <p className="font-medium text-destructive">Unsupported Network</p>
            <p className="text-sm text-muted-foreground">
              Please switch to Ethereum Mainnet or Sepolia to use this app.
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => switchChain({ chainId: mainnet.id })}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : null}
            Switch to Mainnet
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => switchChain({ chainId: sepolia.id })}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : null}
            Switch to Sepolia
          </Button>
        </div>
      </div>
      
      {error && (
        <p className="container mt-2 text-sm text-destructive">
          Failed to switch network: {error.message}
        </p>
      )}
    </div>
  );
}
