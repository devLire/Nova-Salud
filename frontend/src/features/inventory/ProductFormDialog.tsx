import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from "@/lib/types";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  product?: Product | null;
  categories: string[];
  onSubmit: (data: Omit<Product, "id"> | Partial<Product>) => void;
}

const empty = {
  sku: "", name: "", category: "", presentation: "", price: 0, stock: 0, minStock: 10,
};

export function ProductFormDialog({ open, onOpenChange, product, categories, onSubmit }: Props) {
  const [form, setForm] = useState<typeof empty>(empty);
  const [saving, setSaving] = useState(false);
  const editing = !!product;

  useEffect(() => {
    if (product) setForm({
      sku: product.sku, name: product.name, category: product.category,
      presentation: product.presentation, price: product.price,
      stock: product.stock, minStock: product.minStock,
    });
    else setForm(empty);
  }, [product, open]);

  const handleSave = async () => {
    if (!form.name.trim() || !form.sku.trim()) {
      toast.error("Nombre y SKU son obligatorios");
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 350)); // simulate API
    onSubmit(form);
    setSaving(false);
    onOpenChange(false);
    toast.success(editing ? "Producto actualizado" : "Producto creado");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>{editing ? "Editar producto" : "Nuevo producto"}</DialogTitle>
          <DialogDescription>Información del medicamento o insumo.</DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <Label>Nombre</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>SKU</Label>
            <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value.toUpperCase() })} />
          </div>
          <div>
            <Label>Categoría</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue placeholder="Seleccionar…" /></SelectTrigger>
              <SelectContent>
                {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                <SelectItem value="Otros">Otros</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2">
            <Label>Presentación</Label>
            <Input value={form.presentation} onChange={(e) => setForm({ ...form, presentation: e.target.value })} placeholder="Ej. Caja x 20 tabletas" />
          </div>
          <div>
            <Label>Precio (S/)</Label>
            <Input type="number" step="0.10" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })} />
          </div>
          <div>
            <Label>Stock</Label>
            <Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })} />
          </div>
          <div>
            <Label>Stock mínimo</Label>
            <Input type="number" value={form.minStock} onChange={(e) => setForm({ ...form, minStock: parseInt(e.target.value) || 0 })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving} className="bg-gradient-primary">
            {saving ? "Guardando…" : editing ? "Guardar cambios" : "Crear producto"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
