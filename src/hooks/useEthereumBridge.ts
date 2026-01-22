import { useCallback, useState, useEffect } from "react";
import { 
  useAccount, 
  useWriteContract, 
  useWaitForTransactionReceipt,
  useReadContract,
  useChainId,
  useConfig 
} from "wagmi";
import { parseUnits, formatUnits, type Hash, type Address } from "viem";
import { USDC_ADDRESSES, XRESERVE_ADDRESSES, STACKS_DOMAIN_ID, mainnet } from "@/config/wagmi";
import { encodeStacksAddressForBridge } from "@/lib/stacks-address";

// ERC-20 ABI for USDC
const ERC20_ABI = [
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

// xReserve Bridge ABI
const XRESERVE_ABI = [
  {
    inputs: [
      { name: "value", type: "uint256" },
      { name: "remoteDomain", type: "uint32" },
      { name: "remoteRecipient", type: "bytes32" },
      { name: "localToken", type: "address" },
      { name: "maxFee", type: "uint256" },
      { name: "hookData", type: "bytes" },
    ],
    name: "depositToRemote",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export type BridgeTxStatus = "idle" | "pending" | "confirming" | "success" | "error";

export interface EthereumBridgeState {
  approvalStatus: BridgeTxStatus;
  approvalHash: Hash | undefined;
  approvalError: Error | null;
  bridgeStatus: BridgeTxStatus;
  bridgeHash: Hash | undefined;
  bridgeError: Error | null;
  allowance: bigint;
}

export function useEthereumBridge() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  
  const [lastApprovalHash, setLastApprovalHash] = useState<Hash | undefined>();
  const [lastBridgeHash, setLastBridgeHash] = useState<Hash | undefined>();
  
  // Get contract addresses based on chain
  const usdcAddress = USDC_ADDRESSES[chainId as keyof typeof USDC_ADDRESSES] || USDC_ADDRESSES[mainnet.id];
  const xReserveAddress = XRESERVE_ADDRESSES[chainId as keyof typeof XRESERVE_ADDRESSES] || XRESERVE_ADDRESSES[mainnet.id];

  // Check current allowance
  const { data: allowanceData, refetch: refetchAllowance } = useReadContract({
    address: usdcAddress as Address,
    abi: ERC20_ABI,
    functionName: "allowance",
    args: address ? [address, xReserveAddress as Address] : undefined,
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Get USDC balance
  const { data: balanceData, refetch: refetchBalance } = useReadContract({
    address: usdcAddress as Address,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: isConnected && !!address,
    },
  });

  // Approval transaction
  const { 
    writeContract: writeApproval, 
    data: approvalHash,
    isPending: isApprovalPending,
    error: approvalWriteError,
    reset: resetApproval,
  } = useWriteContract();

  // Bridge transaction
  const {
    writeContract: writeBridge,
    data: bridgeHash,
    isPending: isBridgePending,
    error: bridgeWriteError,
    reset: resetBridge,
  } = useWriteContract();

  // Wait for approval confirmation
  const { 
    isLoading: isApprovalConfirming, 
    isSuccess: isApprovalConfirmed,
    error: approvalReceiptError,
  } = useWaitForTransactionReceipt({
    hash: approvalHash,
  });

  // Wait for bridge confirmation
  const {
    isLoading: isBridgeConfirming,
    isSuccess: isBridgeConfirmed,
    error: bridgeReceiptError,
  } = useWaitForTransactionReceipt({
    hash: bridgeHash,
  });

  // Update last hashes when new ones come in
  useEffect(() => {
    if (approvalHash) setLastApprovalHash(approvalHash);
  }, [approvalHash]);

  useEffect(() => {
    if (bridgeHash) setLastBridgeHash(bridgeHash);
  }, [bridgeHash]);

  // Refetch allowance after approval is confirmed
  useEffect(() => {
    if (isApprovalConfirmed) {
      refetchAllowance();
    }
  }, [isApprovalConfirmed, refetchAllowance]);

  // Refetch balance after bridge is confirmed
  useEffect(() => {
    if (isBridgeConfirmed) {
      refetchBalance();
    }
  }, [isBridgeConfirmed, refetchBalance]);

  // Approve USDC spending
  const approveUsdc = useCallback(async (amount: string) => {
    if (!address) throw new Error("Wallet not connected");
    
    const amountInWei = parseUnits(amount, 6); // USDC has 6 decimals
    
    writeApproval({
      address: usdcAddress as Address,
      abi: ERC20_ABI,
      functionName: "approve",
      args: [xReserveAddress as Address, amountInWei],
    } as any);
  }, [address, usdcAddress, xReserveAddress, writeApproval]);

  // Bridge USDC to Stacks via xReserve
  const bridgeToStacks = useCallback(async (amount: string, stacksRecipient: string) => {
    if (!address) throw new Error("Wallet not connected");
    if (!stacksRecipient) throw new Error("Stacks recipient address required");
    
    const amountInWei = parseUnits(amount, 6); // USDC has 6 decimals
    const remoteRecipient = encodeStacksAddressForBridge(stacksRecipient);
    
    // maxFee set to 0 for demo (in production, calculate based on gas estimates)
    const maxFee = BigInt(0);
    
    writeBridge({
      address: xReserveAddress as Address,
      abi: XRESERVE_ABI,
      functionName: "depositToRemote",
      args: [
        amountInWei,
        STACKS_DOMAIN_ID,
        remoteRecipient,
        usdcAddress as Address,
        maxFee,
        "0x" as `0x${string}`, // Empty hook data
      ],
    } as any);
  }, [address, usdcAddress, xReserveAddress, writeBridge]);

  // Check if amount is already approved
  const hasAllowance = useCallback((amount: string): boolean => {
    if (!allowanceData) return false;
    const amountInWei = parseUnits(amount, 6);
    return allowanceData >= amountInWei;
  }, [allowanceData]);

  // Get approval status
  const getApprovalStatus = (): BridgeTxStatus => {
    if (approvalWriteError || approvalReceiptError) return "error";
    if (isApprovalConfirmed) return "success";
    if (isApprovalConfirming) return "confirming";
    if (isApprovalPending) return "pending";
    return "idle";
  };

  // Get bridge status
  const getBridgeStatus = (): BridgeTxStatus => {
    if (bridgeWriteError || bridgeReceiptError) return "error";
    if (isBridgeConfirmed) return "success";
    if (isBridgeConfirming) return "confirming";
    if (isBridgePending) return "pending";
    return "idle";
  };

  // Reset all state
  const reset = useCallback(() => {
    resetApproval();
    resetBridge();
    setLastApprovalHash(undefined);
    setLastBridgeHash(undefined);
  }, [resetApproval, resetBridge]);

  return {
    // State
    approvalStatus: getApprovalStatus(),
    approvalHash: lastApprovalHash,
    approvalError: approvalWriteError || approvalReceiptError || null,
    bridgeStatus: getBridgeStatus(),
    bridgeHash: lastBridgeHash,
    bridgeError: bridgeWriteError || bridgeReceiptError || null,
    allowance: allowanceData ?? BigInt(0),
    usdcBalance: balanceData ? parseFloat(formatUnits(balanceData, 6)) : 0,
    
    // Actions
    approveUsdc,
    bridgeToStacks,
    hasAllowance,
    reset,
    refetchAllowance,
    refetchBalance,
    
    // Derived
    isApprovalConfirmed,
    isBridgeConfirmed,
    isApprovalPending: isApprovalPending || isApprovalConfirming,
    isBridgePending: isBridgePending || isBridgeConfirming,
  };
}
