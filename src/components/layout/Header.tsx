import { Link, useLocation } from "react-router-dom";
import { useChainId } from "wagmi";
import { Button } from "@/components/ui/button";
import { Wallet, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAddress } from "@/hooks/useEthereumWallet";
import { mainnet, sepolia } from "@/config/wagmi";
import { EthereumWallet, StacksWallet } from "@/types";

interface HeaderProps {
  ethereumWallet: EthereumWallet;
  stacksWallet: StacksWallet;
  onConnectEthereum: () => void;
  onConnectStacks: () => void;
}

// Get network display name
function getNetworkName(chainId: number): string {
  switch (chainId) {
    case mainnet.id:
      return "Mainnet";
    case sepolia.id:
      return "Sepolia";
    default:
      return "Unknown";
  }
}

export function Header({
  ethereumWallet,
  stacksWallet,
  onConnectEthereum,
  onConnectStacks,
}: HeaderProps) {
  const location = useLocation();
  const chainId = useChainId();

  const navItems = [
    { path: "/", label: "Bridge & Deposit" },
    { path: "/portfolio", label: "Portfolio" },
  ];

  const networkName = getNetworkName(chainId);
  const isConnected = ethereumWallet.status === "connected";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Layers className="h-6 w-6 text-primary" />
          <span className="hidden text-lg font-bold sm:inline-block">
            <span className="gradient-text">USDCx</span>{" "}
            <span className="text-foreground">Liquidity Hub</span>
          </span>
        </Link>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 rounded-lg bg-secondary/50 p-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "rounded-md px-4 py-2 text-sm font-medium transition-all duration-200",
                location.pathname === item.path
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Wallet Buttons */}
        <div className="flex items-center gap-2">
          {/* Network Badge - shown when connected */}
          {isConnected && (
            <div className="hidden items-center gap-1.5 rounded-md border border-border bg-secondary/50 px-2.5 py-1.5 text-xs font-medium sm:flex">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  chainId === mainnet.id
                    ? "bg-emerald-500"
                    : chainId === sepolia.id
                    ? "bg-amber-500"
                    : "bg-destructive"
                )}
              />
              <span className="text-muted-foreground">{networkName}</span>
            </div>
          )}

          <Button
            variant="wallet"
            size="sm"
            onClick={onConnectEthereum}
            disabled={ethereumWallet.status === "connecting"}
            className={cn(
              "min-w-[130px]",
              ethereumWallet.status === "connected" && "border-primary/50"
            )}
          >
            <Wallet className="h-4 w-4" />
            {ethereumWallet.status === "connecting" ? (
              "Connecting..."
            ) : ethereumWallet.status === "connected" ? (
              formatAddress(ethereumWallet.address)
            ) : (
              <span className="hidden sm:inline">Connect Ethereum</span>
            )}
          </Button>

          <Button
            variant="wallet"
            size="sm"
            onClick={onConnectStacks}
            disabled={stacksWallet.status === "connecting"}
            className={cn(
              "min-w-[130px]",
              stacksWallet.status === "connected" && "border-primary/50"
            )}
          >
            <Layers className="h-4 w-4" />
            {stacksWallet.status === "connecting" ? (
              "Connecting..."
            ) : stacksWallet.status === "connected" ? (
              formatAddress(stacksWallet.principal)
            ) : (
              <span className="hidden sm:inline">Connect Stacks</span>
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
