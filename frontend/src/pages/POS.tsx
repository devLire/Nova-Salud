import { useEffect, useMemo, useRef, useState } from "react";
import { usePharmacyStore, getStockState } from "@/store/usePharmacyStore";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Minus, Trash2, ShoppingCart, CheckCircle2, Timer, AlertCircle, User } from "lucide-react";
import { StockBadge } from "@/components/StockBadge";
import { toast } from "sonner";
import type { SaleItem } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function POS() {
  const { products, registerSale, customers } = usePharmacyStore();
  const [query, setQuery] = useState("");
  const [cart, setCart] = useState<SaleItem[]>([]);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [customerId, setCustomerId] = useState<string>("walkin");
  const [processing, setProcessing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    if (!startedAt) return;
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 500);
    return () => clearInterval(id);
  }, [startedAt]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.slice(0, 8);
    return products.filter(
      (p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
    ).slice(0, 12);
  }, [products, query]);

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const itemsCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    if (product.stock <= 0) { toast.error("Producto sin stock", { description: product.name }); return; }
    if (!startedAt) setStartedAt(Date.now());
    setCart((curr) => {
      const existing = curr.find((i) => i.productId === productId);
      if (existing) {
        if (existing.qty + 1 > product.stock) { toast.warning(`Stock máximo alcanzado (${product.stock})`); return curr; }
        return curr.map((i) => i.productId === productId ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...curr, { productId, name: product.name, price: product.price, qty: 1 }];
    });
    setQuery("");
    inputRef.current?.focus();
  };

  const changeQty = (productId: string, delta: number) =>
    setCart((curr) => curr.map((i) => i.productId === productId ? { ...i, qty: i.qty + delta } : i).filter((i) => i.qty > 0));

  const removeItem = (productId: string) => setCart((c) => c.filter((i) => i.productId !== productId));

  const completeSale = async () => {
    if (cart.length === 0) return;
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 400)); // simulate API
    const duration = startedAt ? Math.floor((Date.now() - startedAt) / 1000) : 0;
    const sale = registerSale(cart, duration, customerId === "walkin" ? undefined : customerId);
    toast.success(`Venta #${sale.id.slice(-5)} registrada`, {
      description: `S/ ${sale.total.toFixed(2)} • ${duration}s de atención`,
      icon: <CheckCircle2 className="h-4 w-4" />,
    });
    setCart([]); setStartedAt(null); setElapsed(0); setCustomerId("walkin"); setProcessing(false);
  };

  return (
    <div className="grid lg:grid-cols-[1fr_420px] gap-4 h-[calc(100vh-7rem)]">
      <div className="flex flex-col gap-4 min-h-0">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && filtered[0]) addToCart(filtered[0].id); }}
              placeholder="Buscar por nombre, SKU o categoría… (Enter agrega el primero)"
              className="pl-9 h-12 text-base bg-card shadow-card" />
          </div>
          {startedAt && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-sm font-medium">
              <Timer className="h-4 w-4" /> {elapsed}s
            </div>
          )}
        </div>

        <Card className="flex-1 overflow-y-auto p-2 shadow-card">
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2">
            {filtered.map((p) => {
              const state = getStockState(p);
              const disabled = state === "out";
              return (
                <button key={p.id} disabled={disabled} onClick={() => addToCart(p.id)}
                  className="text-left p-3 rounded-lg border border-border bg-card hover:border-primary hover:shadow-elegant disabled:opacity-50 disabled:cursor-not-allowed transition group">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-sm truncate group-hover:text-primary">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{p.sku} • {p.presentation}</p>
                    </div>
                    <StockBadge state={state} />
                  </div>
                  <div className="flex items-end justify-between mt-3">
                    <p className="text-lg font-bold tracking-tight">S/ {p.price.toFixed(2)}</p>
                    <p className="text-[11px] text-muted-foreground">{p.stock} disp.</p>
                  </div>
                </button>
              );
            })}
            {filtered.length === 0 && (
              <p className="col-span-full text-center text-sm text-muted-foreground py-10">Sin coincidencias para "{query}".</p>
            )}
          </div>
        </Card>
      </div>

      <Card className="flex flex-col shadow-elegant border-primary/20">
        <div className="p-4 border-b border-border bg-gradient-primary text-primary-foreground rounded-t-xl">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <h2 className="font-semibold">Venta en curso</h2>
            <span className="ml-auto text-xs opacity-90">{itemsCount} ítems</span>
          </div>
        </div>

        <div className="px-3 pt-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <Select value={customerId} onValueChange={setCustomerId}>
              <SelectTrigger className="h-9 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="walkin">Cliente ocasional</SelectItem>
                {customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} • {c.document}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {cart.length === 0 ? (
            <div className="h-full grid place-items-center text-center p-6">
              <div>
                <ShoppingCart className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Selecciona productos para iniciar la venta.</p>
              </div>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {cart.map((it) => (
                <li key={it.productId} className="p-3 flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{it.name}</p>
                    <p className="text-xs text-muted-foreground">S/ {it.price.toFixed(2)} c/u</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => changeQty(it.productId, -1)}><Minus className="h-3 w-3" /></Button>
                    <span className="w-6 text-center text-sm font-semibold">{it.qty}</span>
                    <Button size="icon" variant="outline" className="h-7 w-7" onClick={() => changeQty(it.productId, +1)}><Plus className="h-3 w-3" /></Button>
                  </div>
                  <p className="w-16 text-right text-sm font-semibold">S/ {(it.price * it.qty).toFixed(2)}</p>
                  <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={() => removeItem(it.productId)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border p-4 space-y-3 bg-secondary/30 rounded-b-xl">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>S/ {total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-end">
            <span className="text-sm font-medium">Total</span>
            <span className="text-3xl font-bold tracking-tight">S/ {total.toFixed(2)}</span>
          </div>
          {cart.some((i) => { const p = products.find((x) => x.id === i.productId); return p && i.qty >= p.stock; }) && (
            <p className="text-[11px] text-warning-foreground bg-warning/15 border border-warning/30 rounded px-2 py-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Algún ítem alcanzó el stock máximo.
            </p>
          )}
          <Button disabled={cart.length === 0 || processing} onClick={completeSale}
            className="w-full h-12 text-base font-semibold bg-gradient-primary hover:opacity-95 shadow-elegant">
            {processing ? "Procesando…" : `Cobrar S/ ${total.toFixed(2)}`}
          </Button>
        </div>
      </Card>
    </div>
  );
}
