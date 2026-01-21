import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wallet } from "lucide-react";
import { WalletBalanceRow } from "@/types";

interface WalletBalancesCardProps {
  balances: WalletBalanceRow[];
  isConnected: boolean;
}

function SkeletonRow() {
  return (
    <TableRow>
      <TableCell>
        <div className="h-4 w-16 shimmer rounded" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-20 shimmer rounded" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 shimmer rounded" />
      </TableCell>
      <TableCell>
        <div className="h-4 w-16 shimmer rounded" />
      </TableCell>
    </TableRow>
  );
}

export function WalletBalancesCard({
  balances,
  isConnected,
}: WalletBalancesCardProps) {
  const getChainBadge = (chain: string) => {
    if (chain === "Ethereum") {
      return (
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded-full bg-[#627eea]/20 text-center text-xs leading-5">
            Ξ
          </div>
          <span>{chain}</span>
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2">
        <div className="h-5 w-5 rounded-full bg-primary/20 text-center text-xs leading-5">
          S
        </div>
        <span>{chain}</span>
      </div>
    );
  };

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wallet className="h-4 w-4 text-primary" />
          Wallet Balances
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Wallet className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">
              Connect your wallets to view balances
            </p>
          </div>
        ) : balances.length === 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead>Chain</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Value (USD)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <SkeletonRow />
              <SkeletonRow />
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-muted-foreground">Asset</TableHead>
                <TableHead className="text-muted-foreground">Chain</TableHead>
                <TableHead className="text-muted-foreground">Balance</TableHead>
                <TableHead className="text-muted-foreground">
                  Value (USD)
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {balances.map((row, index) => (
                <TableRow key={index} className="border-border/50">
                  <TableCell className="font-medium">{row.asset}</TableCell>
                  <TableCell>{getChainBadge(row.chain)}</TableCell>
                  <TableCell className="font-mono">
                    {row.balance.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="font-mono text-foreground">
                    ${row.valueUsd.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
