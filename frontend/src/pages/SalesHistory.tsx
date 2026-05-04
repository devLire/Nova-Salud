import { useState } from "react";
import { usePharmacyStore } from "@/store/usePharmacyStore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Search, Receipt, Timer, User } from "lucide-react";
import type { Sale } from "@/lib/types";

export default function SalesHistory() {
  const { sales } = usePharmacyStore();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<Sale | null>(null);

  const filtered = sales.filter((s) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return s.id.includes(q) || (s.customer || "").toLowerCase().includes(q);
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Historial de ventas</h1>
        <p className="text-sm text-muted-foreground">Auditoría completa de transacciones registradas.</p>
      </div>

      <Card className="p-3 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por ID o cliente…" className="pl-9" />
        </div>
      </Card>

      <Card className="overflow-hidden shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left p-3">Venta</th>
              <th className="text-left p-3">Fecha</th>
              <th className="text-left p-3">Cliente</th>
              <th className="text-right p-3">Ítems</th>
              <th className="text-right p-3">Atención</th>
              <th className="text-right p-3">Total</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s.id} className="border-t border-border hover:bg-secondary/30 cursor-pointer" onClick={() => setView(s)}>
                <td className="p-3 font-mono text-xs">#{s.id.slice(-6)}</td>
                <td className="p-3 text-xs">{new Date(s.createdAt).toLocaleString()}</td>
                <td className="p-3 text-xs">{s.customer || <span className="text-muted-foreground">—</span>}</td>
                <td className="p-3 text-right">{s.items.length}</td>
                <td className="p-3 text-right">{s.durationSec}s</td>
                <td className="p-3 text-right font-semibold">S/ {s.total.toFixed(2)}</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-sm text-muted-foreground">Sin ventas registradas.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      <Sheet open={!!view} onOpenChange={(v) => !v && setView(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {view && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2"><Receipt className="h-5 w-5 text-primary" /> Venta #{view.id.slice(-6)}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-1 text-sm">
                <p className="flex items-center gap-2"><Timer className="h-4 w-4 text-muted-foreground" /> {view.durationSec}s de atención</p>
                {view.customer && <p className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" /> {view.customer}</p>}
                <p className="text-xs text-muted-foreground">{new Date(view.createdAt).toLocaleString()}</p>
              </div>
              <div className="mt-4 border-t border-border pt-4">
                {view.items.map((it) => (
                  <div key={it.productId} className="flex justify-between py-2 text-sm border-b border-border/50">
                    <div>
                      <p className="font-medium">{it.name}</p>
                      <p className="text-xs text-muted-foreground">{it.qty} × S/ {it.price.toFixed(2)}</p>
                    </div>
                    <p className="font-semibold">S/ {(it.qty * it.price).toFixed(2)}</p>
                  </div>
                ))}
                <div className="flex justify-between mt-3 text-lg font-bold">
                  <span>Total</span>
                  <span>S/ {view.total.toFixed(2)}</span>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
