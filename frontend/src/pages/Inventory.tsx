import { useMemo, useState } from "react";
import { usePharmacyStore, getStockState, type StockState } from "@/store/usePharmacyStore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StockBadge } from "@/components/StockBadge";
import { Search, Pencil, Plus, Eye, Trash2, Download, PackagePlus } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ProductFormDialog } from "@/features/inventory/ProductFormDialog";
import { ProductDetailSheet } from "@/features/inventory/ProductDetailSheet";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import type { Product } from "@/lib/types";

export default function Inventory() {
  const { products, updateProduct, addProduct, deleteProduct } = usePharmacyStore();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"all" | StockState>("all");
  const [category, setCategory] = useState<string>("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Product | null>(null);
  const [viewTarget, setViewTarget] = useState<Product | null>(null);
  const [delTarget, setDelTarget] = useState<Product | null>(null);

  const categories = Array.from(new Set(products.map((p) => p.category)));

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      if (q && !(p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))) return false;
      if (category !== "all" && p.category !== category) return false;
      if (filter !== "all" && getStockState(p) !== filter) return false;
      return true;
    });
  }, [products, query, filter, category]);

  const exportCSV = () => {
    const header = "SKU,Nombre,Categoría,Precio,Stock,Mínimo\n";
    const rows = filtered.map((p) => `${p.sku},"${p.name}",${p.category},${p.price},${p.stock},${p.minStock}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `inventario-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Inventario exportado");
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Inventario</h1>
          <p className="text-sm text-muted-foreground">Control centralizado de stock, precios y reposición.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-1" /> Exportar CSV</Button>
          <Button className="bg-gradient-primary" onClick={() => { setEditTarget(null); setFormOpen(true); }}>
            <PackagePlus className="h-4 w-4 mr-1" /> Nuevo producto
          </Button>
        </div>
      </div>

      <Card className="p-3 shadow-card">
        <div className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre o SKU…" className="pl-9" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-[180px]"><SelectValue placeholder="Categoría" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex gap-1 rounded-lg border border-border p-1 bg-secondary/40">
            {(["all", "normal", "low", "critical", "out"] as const).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition ${filter === f ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {f === "all" ? "Todos" : f === "normal" ? "Normal" : f === "low" ? "Bajo" : f === "critical" ? "Crítico" : "Agotado"}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <Card className="overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="text-left p-3">Producto</th>
                <th className="text-left p-3">SKU</th>
                <th className="text-left p-3">Categoría</th>
                <th className="text-right p-3">Precio</th>
                <th className="text-right p-3">Stock</th>
                <th className="text-right p-3">Mín.</th>
                <th className="text-left p-3">Estado</th>
                <th className="p-3 w-40"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const state = getStockState(p);
                return (
                  <tr key={p.id} className="border-t border-border hover:bg-secondary/30">
                    <td className="p-3">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.presentation}</p>
                    </td>
                    <td className="p-3 font-mono text-xs">{p.sku}</td>
                    <td className="p-3 text-xs">{p.category}</td>
                    <td className="p-3 text-right">S/ {p.price.toFixed(2)}</td>
                    <td className="p-3 text-right font-semibold">
                      <div className="inline-flex items-center gap-1">
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateProduct(p.id, { stock: Math.max(0, p.stock - 1) })} title="Restar 1">
                          <Plus className="h-3 w-3 rotate-45" />
                        </Button>
                        <span className="w-10 text-center">{p.stock}</span>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => updateProduct(p.id, { stock: p.stock + 1 })} title="Sumar 1">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </td>
                    <td className="p-3 text-right">{p.minStock}</td>
                    <td className="p-3"><StockBadge state={state} /></td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewTarget(p)} title="Ver detalle">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => { setEditTarget(p); setFormOpen(true); }} title="Editar">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDelTarget(p)} title="Eliminar">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="p-8 text-center text-sm text-muted-foreground">Sin productos que coincidan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editTarget}
        categories={categories}
        onSubmit={(data) => {
          if (editTarget) updateProduct(editTarget.id, data);
          else addProduct(data as any);
        }}
      />
      <ProductDetailSheet product={viewTarget} open={!!viewTarget} onOpenChange={(v) => !v && setViewTarget(null)} />
      <ConfirmDialog
        open={!!delTarget}
        onOpenChange={(v) => !v && setDelTarget(null)}
        title="Eliminar producto"
        description={`Se eliminará "${delTarget?.name}" del inventario.`}
        destructive
        confirmLabel="Eliminar"
        onConfirm={() => {
          if (delTarget) {
            deleteProduct(delTarget.id);
            toast.success("Producto eliminado");
            setDelTarget(null);
          }
        }}
      />
    </div>
  );
}
