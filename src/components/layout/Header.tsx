import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Wallet, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatAddress } from "@/hooks/useEthereumWallet";
import { EthereumWallet, StacksWallet } from "@/types";

interface HeaderProps {
  ethereumWallet: EthereumWallet;
  stacksWallet: StacksWallet;
  onConnectEthereum: () => void;
  onConnectStacks: () => void;
}

export function Header({
  ethereumWallet,
  stacksWallet,
  onConnectEthereum,
  onConnectStacks,
}: HeaderProps) {
  const location = useLocation();

  const navItems = [
    { path: "/", label: "Bridge & Deposit" },
    { path: "/portfolio", label: "Portfolio" },
  ];

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
