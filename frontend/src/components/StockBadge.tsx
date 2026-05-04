import { cn } from "@/lib/utils";
import type { StockState } from "@/store/usePharmacyStore";

const config: Record<StockState, { label: string; cls: string }> = {
  normal:   { label: "Normal",   cls: "bg-success/10 text-success border-success/20" },
  low:      { label: "Stock bajo", cls: "bg-warning/15 text-warning-foreground border-warning/30" },
  critical: { label: "Crítico",  cls: "bg-critical/10 text-critical border-critical/30" },
  out:      { label: "Agotado",  cls: "bg-muted text-muted-foreground border-border" },
};

export function StockBadge({ state, className }: { state: StockState; className?: string }) {
  const c = config[state];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium", c.cls, className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full",
        state === "normal" && "bg-success",
        state === "low" && "bg-warning",
        state === "critical" && "bg-critical animate-pulse",
        state === "out" && "bg-muted-foreground"
      )} />
      {c.label}
    </span>
  );
}
