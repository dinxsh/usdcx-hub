import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { NetworkSwitcher } from "@/components/NetworkSwitcher";
import { EthereumWallet, StacksWallet } from "@/types";

interface LayoutProps {
  children: ReactNode;
  ethereumWallet: EthereumWallet;
  stacksWallet: StacksWallet;
  onConnectEthereum: () => void;
  onConnectStacks: () => void;
}

export function Layout({
  children,
  ethereumWallet,
  stacksWallet,
  onConnectEthereum,
  onConnectStacks,
}: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header
        ethereumWallet={ethereumWallet}
        stacksWallet={stacksWallet}
        onConnectEthereum={onConnectEthereum}
        onConnectStacks={onConnectStacks}
      />
      <NetworkSwitcher />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
