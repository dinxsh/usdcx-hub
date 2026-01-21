import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { BridgePage } from "@/pages/BridgePage";
import { PortfolioPage } from "@/pages/PortfolioPage";
import { useWallets } from "@/hooks/useWallets";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function AppContent() {
  const {
    ethereumWallet,
    stacksWallet,
    isFullyConnected,
    connectEthereum,
    connectStacks,
  } = useWallets();

  return (
    <Layout
      ethereumWallet={ethereumWallet}
      stacksWallet={stacksWallet}
      onConnectEthereum={connectEthereum}
      onConnectStacks={connectStacks}
    >
      <Routes>
        <Route
          path="/"
          element={
            <BridgePage
              ethereumWallet={ethereumWallet}
              stacksWallet={stacksWallet}
              onConnectEthereum={connectEthereum}
              onConnectStacks={connectStacks}
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
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
