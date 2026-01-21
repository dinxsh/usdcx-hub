import { Layers } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container flex h-14 items-center justify-center px-4">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Powered by</span>
          <Layers className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">USDCx on Stacks</span>
          <span className="text-border">·</span>
          <span>Hackathon demo</span>
        </p>
      </div>
    </footer>
  );
}
