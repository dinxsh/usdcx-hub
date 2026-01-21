import { Check, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { BridgeStep, StepperState } from "@/types";

interface StepperProps extends StepperState {}

const steps: { step: BridgeStep; label: string }[] = [
  { step: 1, label: "Connect Wallets" },
  { step: 2, label: "Approve USDC" },
  { step: 3, label: "Bridge to USDCx" },
  { step: 4, label: "Deposit to Strategy" },
  { step: 5, label: "Complete" },
];

export function Stepper({ currentStep, errorStep }: StepperProps) {
  const getStepStatus = (step: BridgeStep) => {
    if (errorStep === step) return "error";
    if (step < currentStep) return "completed";
    if (step === currentStep) return "active";
    return "inactive";
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        {steps.map((item, index) => {
          const status = getStepStatus(item.step);
          const isLast = index === steps.length - 1;

          return (
            <div key={item.step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",
                    status === "completed" &&
                      "border-primary bg-primary text-primary-foreground",
                    status === "active" &&
                      "border-primary bg-primary/20 text-primary animate-pulse-glow",
                    status === "inactive" &&
                      "border-border bg-secondary text-muted-foreground",
                    status === "error" &&
                      "border-destructive bg-destructive/20 text-destructive"
                  )}
                >
                  {status === "completed" ? (
                    <Check className="h-5 w-5" />
                  ) : status === "error" ? (
                    <AlertCircle className="h-5 w-5" />
                  ) : (
                    item.step
                  )}
                </div>
                <span
                  className={cn(
                    "hidden text-xs font-medium text-center max-w-[80px] md:block",
                    status === "active" && "text-primary",
                    status === "completed" && "text-foreground",
                    status === "inactive" && "text-muted-foreground",
                    status === "error" && "text-destructive"
                  )}
                >
                  {item.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={cn(
                    "mx-2 h-0.5 flex-1 transition-colors duration-300",
                    item.step < currentStep ? "bg-primary" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
