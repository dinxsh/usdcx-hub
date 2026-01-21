import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, History } from "lucide-react";
import { cn } from "@/lib/utils";
import { TxItem } from "@/types";

interface TransactionHistoryProps {
  transactions: TxItem[];
}

export function TransactionHistory({ transactions }: TransactionHistoryProps) {
  const getStatusBadge = (status: TxItem["status"]) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="border-warning/50 bg-warning/10 text-warning"
          >
            Pending
          </Badge>
        );
      case "confirmed":
        return (
          <Badge
            variant="outline"
            className="border-success/50 bg-success/10 text-success"
          >
            Confirmed
          </Badge>
        );
      case "failed":
        return (
          <Badge
            variant="outline"
            className="border-destructive/50 bg-destructive/10 text-destructive"
          >
            Failed
          </Badge>
        );
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <History className="h-4 w-4 text-primary" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <History className="mb-2 h-8 w-8 text-muted-foreground/50" />
            <p className="text-sm text-muted-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground/70">
              Your bridge history will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center justify-between rounded-lg border border-border/50 bg-secondary/30 p-3 transition-colors hover:border-border"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium">{tx.label}</p>
                  <p className="text-xs text-muted-foreground">{tx.subtitle}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  {getStatusBadge(tx.status)}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatTime(tx.timestamp)}
                    </span>
                    {tx.explorerUrl && (
                      <a
                        href={tx.explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary/80"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
