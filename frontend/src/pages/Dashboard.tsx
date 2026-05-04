import { usePharmacyStore, getStockState } from "@/store/usePharmacyStore";
import { Card } from "@/components/ui/card";
import { Activity, AlertTriangle, ShieldCheck, Timer, TrendingUp, Package } from "lucide-react";
import { StockBadge } from "@/components/StockBadge";
import { useNavigate } from "react-router-dom";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer,
  Tooltip, XAxis, YAxis, Cell,
} from "recharts";
import { useMemo } from "react";

function Stat({ icon: Icon, label, value, hint, tone = "primary" }: any) {
  const tones: Record<string, string> = {
    primary: "from-primary/15 to-accent/10 text-primary",
    warning: "from-warning/20 to-warning/5 text-warning-foreground",
    critical: "from-critical/15 to-critical/5 text-critical",
    success: "from-success/15 to-success/5 text-success",
  };
  return (
    <Card className="p-5 shadow-card border-border/60">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="text-3xl font-bold tracking-tight mt-1">{value}</p>
          {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
        </div>
        <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${tones[tone]} grid place-items-center`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export default function Dashboard() {
  const { products, sales, alerts, errorsAvoided } = usePharmacyStore();
  const navigate = useNavigate();

  const today = new Date().toDateString();
  const todaySales = sales.filter((s) => new Date(s.createdAt).toDateString() === today);
  const revenue = todaySales.reduce((sum, s) => sum + s.total, 0);
  const avgTime = todaySales.length
    ? Math.round(todaySales.reduce((s, x) => s + x.durationSec, 0) / todaySales.length)
    : 0;
  const lowStock = alerts.filter((a) => a.level !== "out").length;
  const outOfStock = alerts.filter((a) => a.level === "out").length;

  const lowStockProducts = products
    .filter((p) => getStockState(p) !== "normal")
    .sort((a, b) => a.stock / a.minStock - b.stock / b.minStock)
    .slice(0, 6);

  // Sales of the last 7 days (real if exists, otherwise base of 0)
  const salesByDay = useMemo(() => {
    const days: { day: string; total: number; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const ds = sales.filter((s) => new Date(s.createdAt).toDateString() === key);
      days.push({
        day: d.toLocaleDateString("es-PE", { weekday: "short" }),
        total: Number(ds.reduce((a, b) => a + b.total, 0).toFixed(2)),
        count: ds.length,
      });
    }
    return days;
  }, [sales]);

  // Stock by category
  const byCategory = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.category, (m.get(p.category) || 0) + p.stock));
    return Array.from(m.entries()).map(([category, stock]) => ({ category, stock }));
  }, [products]);

  const palette = ["hsl(var(--primary))", "hsl(var(--accent))", "hsl(var(--success))", "hsl(var(--warning))", "hsl(var(--critical))", "hsl(var(--primary-glow))"];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Panel operativo</h1>
          <p className="text-sm text-muted-foreground">Resumen en tiempo real — Botica Nova Salud</p>
        </div>
        <button onClick={() => navigate("/ventas")}
          className="inline-flex items-center gap-2 rounded-lg bg-gradient-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-elegant hover:opacity-95 transition">
          <Activity className="h-4 w-4" /> Iniciar venta rápida
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat icon={TrendingUp} tone="primary" label="Ventas hoy" value={`S/ ${revenue.toFixed(2)}`} hint={`${todaySales.length} transacciones`} />
        <Stat icon={Timer} tone="success" label="T. atención prom." value={`${avgTime}s`} hint="Objetivo: < 90 s" />
        <Stat icon={AlertTriangle} tone="warning" label="Productos bajo stock" value={lowStock} hint={`${outOfStock} agotados`} />
        <Stat icon={ShieldCheck} tone="success" label="Errores evitados" value={errorsAvoided} hint="Validaciones del sistema" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Ventas (últimos 7 días)</h2>
            <span className="text-xs text-muted-foreground">en S/</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesByDay}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 shadow-card">
          <h2 className="font-semibold mb-3">Stock por categoría</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCategory} layout="vertical" margin={{ left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis type="category" dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={10} width={90} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="stock" radius={[0, 6, 6, 0]}>
                  {byCategory.map((_, i) => <Cell key={i} fill={palette[i % palette.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold flex items-center gap-2"><Package className="h-4 w-4 text-primary" /> Productos que requieren atención</h2>
            <button onClick={() => navigate("/inventario")} className="text-xs text-primary font-medium hover:underline">Ver inventario →</button>
          </div>
          <div className="divide-y divide-border">
            {lowStockProducts.length === 0 && (
              <p className="text-sm text-muted-foreground py-6 text-center">Todo el inventario en niveles óptimos ✓</p>
            )}
            {lowStockProducts.map((p) => (
              <div key={p.id} className="py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.sku} • mín. {p.minStock}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold">{p.stock} <span className="text-xs text-muted-foreground font-normal">unid.</span></p>
                </div>
                <StockBadge state={getStockState(p)} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 shadow-card">
          <h2 className="font-semibold mb-4">Últimas ventas</h2>
          <div className="space-y-3">
            {sales.slice(0, 6).map((s) => (
              <div key={s.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium">#{s.id.slice(-5)}</p>
                  <p className="text-xs text-muted-foreground">{s.items.length} ítems • {s.durationSec}s</p>
                </div>
                <p className="font-semibold">S/ {s.total.toFixed(2)}</p>
              </div>
            ))}
            {sales.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Aún no hay ventas registradas.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
}
