import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/config/wagmi";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BridgePage } from "@/pages/BridgePage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import { useEthereumWallet } from "@/hooks/useEthereumWallet";
import { useStacksWallet } from "@/hooks/useStacksWallet";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const ethereum = useEthereumWallet();
  const stacks = useStacksWallet();

  const isFullyConnected = ethereum.isConnected && stacks.isConnected;

  return (
    <Layout
      ethereumWallet={ethereum.wallet}
      stacksWallet={stacks.wallet}
      onConnectEthereum={ethereum.connect}
      onConnectStacks={stacks.connect}
    >
      <Routes>
        <Route
          path="/"
          element={
            <BridgePage
              ethereumWallet={ethereum.wallet}
              stacksWallet={stacks.wallet}
              onConnectEthereum={ethereum.connect}
              onConnectStacks={stacks.connect}
              usdcBalance={ethereum.usdcBalance}
            />
          }
        />
        <Route
          path="/portfolio"
          element={<PortfolioPage isConnected={isFullyConnected} />}
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

const App = () => (
  <WagmiProvider config={wagmiConfig}>
    <QueryClientProvider client={queryClient}>
      <RainbowKitProvider
        theme={darkTheme({
          accentColor: "hsl(174, 84%, 45%)",
          accentColorForeground: "hsl(222, 47%, 6%)",
          borderRadius: "medium",
          fontStack: "system",
        })}
      >
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </TooltipProvider>
      </RainbowKitProvider>
    </QueryClientProvider>
  </WagmiProvider>
);

export default App;
