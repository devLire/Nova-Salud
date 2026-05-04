import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import type { Product } from "@/lib/types";
import { StockBadge } from "@/components/StockBadge";
import { getStockState } from "@/store/usePharmacyStore";
import { Pill, Tag, Layers, AlertTriangle, DollarSign } from "lucide-react";

export function ProductDetailSheet({
  product, open, onOpenChange,
}: { product: Product | null; open: boolean; onOpenChange: (v: boolean) => void }) {
  if (!product) return null;
  const state = getStockState(product);
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2"><Pill className="h-5 w-5 text-primary" /> {product.name}</SheetTitle>
          <SheetDescription>Detalle del producto y métricas asociadas.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Estado</span>
            <StockBadge state={state} />
          </div>
          <Row icon={Tag} label="SKU" value={product.sku} />
          <Row icon={Layers} label="Categoría" value={product.category} />
          <Row icon={Pill} label="Presentación" value={product.presentation} />
          <Row icon={DollarSign} label="Precio" value={`S/ ${product.price.toFixed(2)}`} />
          <Row icon={AlertTriangle} label="Stock / mínimo" value={`${product.stock} / ${product.minStock}`} />
          {product.requiresPrescription && (
            <p className="text-xs px-3 py-2 rounded-md bg-warning/15 text-warning-foreground border border-warning/30">
              ⚠ Este producto requiere receta médica.
            </p>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Row({ icon: Icon, label, value }: any) {
  return (
    <div className="flex items-center justify-between border-b border-border py-2">
      <span className="text-sm text-muted-foreground flex items-center gap-2"><Icon className="h-3.5 w-3.5" /> {label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}
