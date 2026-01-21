// Wallet types
export type WalletStatus = "disconnected" | "connecting" | "connected";

export interface EthereumWallet {
  status: WalletStatus;
  address: string | null;
}

export interface StacksWallet {
  status: WalletStatus;
  principal: string | null;
}

// Bridge types
export type BridgeStep = 1 | 2 | 3 | 4 | 5;

export type StepStatus = "inactive" | "active" | "completed" | "error";

export interface StepperState {
  currentStep: BridgeStep;
  errorStep?: BridgeStep;
}

export type StrategyType = "wallet" | "vault";

export interface BridgeFormData {
  amount: string;
  strategy: StrategyType;
}

// Transaction types
export type TxStatus = "pending" | "confirmed" | "failed";

export interface TxItem {
  id: string;
  label: string;
  subtitle: string;
  status: TxStatus;
  explorerUrl?: string;
  timestamp: Date;
}

// Portfolio types
export interface WalletBalanceRow {
  asset: string;
  chain: string;
  balance: number;
  valueUsd: number;
  icon?: string;
}

export interface VaultPosition {
  vaultName: string;
  shares: number;
  underlyingUsdcx: number;
  sharePrice: number;
  status: "active" | "inactive";
}

export interface PortfolioSummary {
  totalValueUsd: number;
  walletValueUsd: number;
  vaultValueUsd: number;
}

// Status types
export type BridgeStatus =
  | "idle"
  | "awaiting_approval"
  | "approving"
  | "awaiting_bridge"
  | "bridging"
  | "minting"
  | "awaiting_deposit"
  | "depositing"
  | "complete";

export interface StatusMessage {
  title: string;
  subtitle: string;
}
