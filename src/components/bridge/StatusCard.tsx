import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Clock, ArrowRightLeft, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { BridgeStatus, StatusMessage } from "@/types";

interface StatusCardProps {
  status: BridgeStatus;
  statusMessage: StatusMessage;
  progressPercent: number;
  amount: string;
}

export function StatusCard({
  status,
  statusMessage,
  progressPercent,
  amount,
}: StatusCardProps) {
  const isComplete = status === "complete";
  const isProcessing = ["approving", "bridging", "minting", "depositing"].includes(
    status
  );

  const StatusIcon = () => {
    if (isComplete) return <CheckCircle2 className="h-8 w-8 text-success" />;
    if (isProcessing) return <Loader2 className="h-8 w-8 text-primary animate-spin" />;
    return <ArrowRightLeft className="h-8 w-8 text-muted-foreground" />;
  };

  return (
    <Card className="border-border/50 bg-card/50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-4 w-4 text-primary" />
          Transaction Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status Display */}
        <div
          className={cn(
            "flex flex-col items-center gap-3 rounded-lg border p-6 text-center",
            isComplete
              ? "border-success/30 bg-success/5"
              : "border-border/50 bg-secondary/30"
          )}
        >
          <StatusIcon />
          <div className="space-y-1">
            <p
              className={cn(
                "text-lg font-semibold",
                isComplete && "text-success"
              )}
            >
              {statusMessage.title}
            </p>
            <p className="text-sm text-muted-foreground">
              {statusMessage.subtitle}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>

        {/* Success Summary */}
        {isComplete && amount && (
          <div className="rounded-lg border border-success/30 bg-success/5 p-4 text-center animate-fade-in">
            <p className="text-sm text-muted-foreground">You bridged</p>
            <p className="text-2xl font-bold text-success">
              {parseFloat(amount).toLocaleString(undefined, {
                minimumFractionDigits: 2,
              })}{" "}
              USDC
            </p>
            <p className="text-sm text-muted-foreground">to USDCx on Stacks</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
