import { usePharmacyStore } from "@/store/usePharmacyStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, AlertOctagon, PackageX, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const levelMeta = {
  out: { icon: PackageX, label: "Agotado", cls: "border-l-critical bg-critical/5", chip: "bg-critical text-critical-foreground" },
  critical: { icon: AlertOctagon, label: "Crítico", cls: "border-l-critical bg-critical/5", chip: "bg-critical text-critical-foreground" },
  low: { icon: AlertTriangle, label: "Bajo", cls: "border-l-warning bg-warning/5", chip: "bg-warning text-warning-foreground" },
} as const;

export default function Alerts() {
  const { alerts, products } = usePharmacyStore();
  const navigate = useNavigate();

  const order = { out: 0, critical: 1, low: 2 } as const;
  const sorted = [...alerts].sort((a, b) => order[a.level] - order[b.level]);

  const counts = {
    out: alerts.filter((a) => a.level === "out").length,
    critical: alerts.filter((a) => a.level === "critical").length,
    low: alerts.filter((a) => a.level === "low").length,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Centro de alertas</h1>
        <p className="text-sm text-muted-foreground">Prioriza la reposición para evitar desabastecimiento.</p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 border-l-4 border-l-critical shadow-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Agotados</p>
          <p className="text-3xl font-bold text-critical">{counts.out}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-critical shadow-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Críticos</p>
          <p className="text-3xl font-bold text-critical">{counts.critical}</p>
        </Card>
        <Card className="p-4 border-l-4 border-l-warning shadow-card">
          <p className="text-xs text-muted-foreground uppercase tracking-wider">Bajo stock</p>
          <p className="text-3xl font-bold text-warning-foreground">{counts.low}</p>
        </Card>
      </div>

      <div className="space-y-2">
        {sorted.length === 0 && (
          <Card className="p-10 text-center shadow-card">
            <p className="text-sm text-muted-foreground">No hay alertas activas. ✓</p>
          </Card>
        )}
        {sorted.map((a) => {
          const product = products.find((p) => p.id === a.productId);
          const meta = levelMeta[a.level];
          const Icon = meta.icon;
          return (
            <Card key={a.id} className={`p-4 border-l-4 shadow-card flex items-center gap-4 ${meta.cls}`}>
              <Icon className="h-5 w-5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold truncate">{product?.name}</p>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${meta.chip}`}>{meta.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {product?.sku} • Stock actual: <strong>{product?.stock}</strong> / mín. {product?.minStock}
                </p>
              </div>
              <Button size="sm" variant="outline" onClick={() => navigate("/inventario")}>
                Reponer <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
