import { Stepper } from "@/components/bridge/Stepper";
import { WalletConnectionPanel } from "@/components/bridge/WalletConnectionPanel";
import { BridgeForm } from "@/components/bridge/BridgeForm";
import { StatusCard } from "@/components/bridge/StatusCard";
import { TransactionHistory } from "@/components/bridge/TransactionHistory";
import { EthereumWallet, StacksWallet } from "@/types";
import { useBridge } from "@/hooks/useBridge";

interface BridgePageProps {
  ethereumWallet: EthereumWallet;
  stacksWallet: StacksWallet;
  onConnectEthereum: () => void;
  onConnectStacks: () => void;
  usdcBalance?: number;
}

export function BridgePage({
  ethereumWallet,
  stacksWallet,
  onConnectEthereum,
  onConnectStacks,
  usdcBalance: externalUsdcBalance,
}: BridgePageProps) {
  // Pass the Stacks principal to useBridge for encoding the recipient address
  const bridge = useBridge(stacksWallet.principal);
  const isFullyConnected =
    ethereumWallet.status === "connected" && stacksWallet.status === "connected";

  // Use bridge hook's real balance (from useEthereumBridge), fall back to external if provided
  const usdcBalance = bridge.usdcBalance || externalUsdcBalance || 0;

  return (
    <div className="container py-6 px-4 lg:py-8">
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Column: Stepper + Forms */}
        <div className="space-y-6 lg:col-span-3">
          <Stepper
            currentStep={bridge.currentStep}
            errorStep={bridge.errorStep}
          />

          <WalletConnectionPanel
            ethereumWallet={ethereumWallet}
            stacksWallet={stacksWallet}
            onConnectEthereum={onConnectEthereum}
            onConnectStacks={onConnectStacks}
          />

          <BridgeForm
            isConnected={isFullyConnected}
            amount={bridge.amount}
            onAmountChange={bridge.setAmount}
            strategy={bridge.strategy}
            onStrategyChange={bridge.setStrategy}
            usdcBalance={usdcBalance}
            status={bridge.status}
            isLoading={bridge.isLoading}
            currentStep={bridge.currentStep}
            errorStep={bridge.errorStep}
            onApprove={bridge.approve}
            onBridge={bridge.bridge}
            onDeposit={bridge.deposit}
            onRetry={bridge.retryStep}
          />
        </div>

        {/* Right Column: Status + History */}
        <div className="space-y-6 lg:col-span-2">
          <StatusCard
            status={bridge.status}
            statusMessage={bridge.currentStatusMessage}
            progressPercent={bridge.progressPercent}
            amount={bridge.amount}
          />

          <TransactionHistory transactions={bridge.transactions} />
        </div>
      </div>
    </div>
  );
}
