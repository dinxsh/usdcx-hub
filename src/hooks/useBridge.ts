import { useState, useCallback, useMemo, useEffect } from "react";
import { BridgeStep, BridgeStatus, StrategyType, TxItem, StatusMessage } from "@/types";
import { useEthereumBridge } from "./useEthereumBridge";
import { useStacksContracts } from "./useStacksContracts";
import { mainnet, sepolia } from "@/config/wagmi";
import { useChainId } from "wagmi";

// Bridge hook with real contract integration
export function useBridge(stacksPrincipal: string | null) {
  const chainId = useChainId();
  const ethereumBridge = useEthereumBridge();
  const stacksContracts = useStacksContracts(stacksPrincipal);
  
  const [currentStep, setCurrentStep] = useState<BridgeStep>(1);
  const [errorStep, setErrorStep] = useState<BridgeStep | undefined>();
  const [status, setStatus] = useState<BridgeStatus>("idle");
  const [amount, setAmount] = useState("");
  const [strategy, setStrategy] = useState<StrategyType>("wallet");
  const [transactions, setTransactions] = useState<TxItem[]>([]);

  // Get explorer URLs based on chain
  const getEtherscanUrl = (hash: string) => {
    if (chainId === sepolia.id) {
      return `https://sepolia.etherscan.io/tx/${hash}`;
    }
    return `https://etherscan.io/tx/${hash}`;
  };

  // Track approval status changes
  useEffect(() => {
    if (ethereumBridge.approvalStatus === "pending") {
      setStatus("awaiting_approval");
    } else if (ethereumBridge.approvalStatus === "confirming") {
      setStatus("approving");
      setCurrentStep(2);
    } else if (ethereumBridge.approvalStatus === "success") {
      setStatus("awaiting_bridge");
      setCurrentStep(3);
      
      // Add to transaction history
      if (ethereumBridge.approvalHash) {
        setTransactions((prev) => {
          // Don't add if already exists
          if (prev.some(tx => tx.id === ethereumBridge.approvalHash)) return prev;
          return [
            {
              id: ethereumBridge.approvalHash!,
              label: "USDC Approval",
              subtitle: `${amount} USDC approved`,
              status: "confirmed",
              explorerUrl: getEtherscanUrl(ethereumBridge.approvalHash!),
              timestamp: new Date(),
            },
            ...prev,
          ];
        });
      }
    } else if (ethereumBridge.approvalStatus === "error") {
      setErrorStep(2);
      setStatus("idle");
    }
  }, [ethereumBridge.approvalStatus, ethereumBridge.approvalHash, amount, chainId]);

  // Track bridge status changes
  useEffect(() => {
    if (ethereumBridge.bridgeStatus === "pending") {
      setStatus("bridging");
    } else if (ethereumBridge.bridgeStatus === "confirming") {
      setStatus("bridging");
    } else if (ethereumBridge.bridgeStatus === "success") {
      // Bridge confirmed on Ethereum, now waiting for minting on Stacks
      setStatus("minting");
      
      // Add to transaction history
      if (ethereumBridge.bridgeHash) {
        setTransactions((prev) => {
          if (prev.some(tx => tx.id === ethereumBridge.bridgeHash)) return prev;
          return [
            {
              id: ethereumBridge.bridgeHash!,
              label: "Bridge to USDCx",
              subtitle: `${amount} USDC → USDCx`,
              status: "confirmed",
              explorerUrl: getEtherscanUrl(ethereumBridge.bridgeHash!),
              timestamp: new Date(),
            },
            ...prev,
          ];
        });
      }
      
      // Simulate minting delay (in production, you'd poll for USDCx arrival)
      setTimeout(() => {
        if (strategy === "vault") {
          setStatus("awaiting_deposit");
          setCurrentStep(4);
        } else {
          setStatus("complete");
          setCurrentStep(5);
        }
      }, 3000);
    } else if (ethereumBridge.bridgeStatus === "error") {
      setErrorStep(3);
      setStatus("awaiting_bridge");
    }
  }, [ethereumBridge.bridgeStatus, ethereumBridge.bridgeHash, amount, strategy, chainId]);

  const statusMessages: Record<BridgeStatus, StatusMessage> = {
    idle: {
      title: "Ready to bridge",
      subtitle: "Enter an amount and connect your wallets to begin.",
    },
    awaiting_approval: {
      title: "Waiting for approval",
      subtitle: "Confirm the USDC approval transaction in your Ethereum wallet.",
    },
    approving: {
      title: "Approving USDC...",
      subtitle: "Transaction submitted. Waiting for confirmation.",
    },
    awaiting_bridge: {
      title: "Ready to bridge",
      subtitle: "Click the button to initiate the bridge to Stacks.",
    },
    bridging: {
      title: "Bridging in progress",
      subtitle: "Your USDC is being bridged to USDCx. This may take 1-3 minutes.",
    },
    minting: {
      title: "Minting USDCx on Stacks...",
      subtitle: "Almost there! Your USDCx is being minted on Stacks.",
    },
    awaiting_deposit: {
      title: "USDCx received!",
      subtitle: "Ready to deposit into the vault strategy.",
    },
    depositing: {
      title: "Depositing into vault...",
      subtitle: "Your USDCx is being deposited into the savings vault.",
    },
    complete: {
      title: "Bridge complete! 🎉",
      subtitle: strategy === "vault" 
        ? "Your USDCx is deposited in the USDCx Savings Vault."
        : "Your USDCx is now in your Stacks wallet.",
    },
  };

  const currentStatusMessage = useMemo(() => statusMessages[status], [status, strategy]);

  const progressPercent = useMemo(() => {
    const stepProgress: Record<BridgeStep, number> = {
      1: 0,
      2: 25,
      3: 50,
      4: 75,
      5: 100,
    };
    return stepProgress[currentStep];
  }, [currentStep]);

  // Check if approval is needed
  const needsApproval = useCallback(() => {
    if (!amount) return true;
    return !ethereumBridge.hasAllowance(amount);
  }, [amount, ethereumBridge]);

  // Approve USDC spending
  const approve = useCallback(async () => {
    if (!amount) return;
    
    setErrorStep(undefined);
    setCurrentStep(2);
    
    try {
      await ethereumBridge.approveUsdc(amount);
    } catch (error) {
      console.error("Approval error:", error);
      setErrorStep(2);
    }
  }, [amount, ethereumBridge]);

  // Bridge USDC to Stacks
  const bridge = useCallback(async () => {
    if (!amount || !stacksPrincipal) return;
    
    setErrorStep(undefined);
    setCurrentStep(3);
    
    try {
      await ethereumBridge.bridgeToStacks(amount, stacksPrincipal);
    } catch (error) {
      console.error("Bridge error:", error);
      setErrorStep(3);
    }
  }, [amount, stacksPrincipal, ethereumBridge]);

  // Deposit USDCx into vault
  const deposit = useCallback(async () => {
    if (!amount) return;
    
    setErrorStep(undefined);
    setStatus("depositing");
    setCurrentStep(4);
    
    try {
      await stacksContracts.depositToVault(parseFloat(amount));
      
      // Add to transaction history
      setTransactions((prev) => [
        {
          id: Date.now().toString(),
          label: "Vault Deposit",
          subtitle: `${amount} USDCx`,
          status: "pending",
          explorerUrl: undefined,
          timestamp: new Date(),
        },
        ...prev,
      ]);
      
      setStatus("complete");
      setCurrentStep(5);
    } catch (error) {
      console.error("Deposit error:", error);
      setErrorStep(4);
      setStatus("awaiting_deposit");
    }
  }, [amount, stacksContracts]);

  // Reset the bridge flow
  const reset = useCallback(() => {
    setCurrentStep(1);
    setErrorStep(undefined);
    setStatus("idle");
    setAmount("");
    setStrategy("wallet");
    ethereumBridge.reset();
  }, [ethereumBridge]);

  // Retry a failed step
  const retryStep = useCallback(() => {
    if (!errorStep) return;
    
    setErrorStep(undefined);
    
    switch (errorStep) {
      case 2:
        approve();
        break;
      case 3:
        bridge();
        break;
      case 4:
        deposit();
        break;
    }
  }, [errorStep, approve, bridge, deposit]);

  // Determine if loading based on pending transactions
  const isLoading = 
    ethereumBridge.isApprovalPending || 
    ethereumBridge.isBridgePending ||
    status === "depositing" ||
    status === "minting";

  return {
    currentStep,
    errorStep,
    status,
    isLoading,
    amount,
    setAmount,
    strategy,
    setStrategy,
    usdcBalance: ethereumBridge.usdcBalance,
    usdcxBalance: stacksContracts.usdcxBalance,
    transactions,
    currentStatusMessage,
    progressPercent,
    needsApproval,
    approve,
    bridge,
    deposit,
    reset,
    retryStep,
    // Expose transaction hashes for UI
    approvalHash: ethereumBridge.approvalHash,
    bridgeHash: ethereumBridge.bridgeHash,
  };
}
