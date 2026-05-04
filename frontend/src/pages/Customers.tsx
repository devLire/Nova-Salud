import { useMemo, useState } from "react";
import { usePharmacyStore } from "@/store/usePharmacyStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { UserPlus, Pencil, Eye, Trash2, Search, User, Phone, Mail, CreditCard } from "lucide-react";
import { toast } from "sonner";
import type { Customer } from "@/lib/types";

const empty = { name: "", document: "", phone: "", email: "", notes: "" };

export default function Customers() {
  const { customers, sales, addCustomer, updateCustomer, deleteCustomer } = usePharmacyStore();
  const [query, setQuery] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Customer | null>(null);
  const [viewTarget, setViewTarget] = useState<Customer | null>(null);
  const [delTarget, setDelTarget] = useState<Customer | null>(null);
  const [form, setForm] = useState(empty);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return customers;
    return customers.filter((c) =>
      c.name.toLowerCase().includes(q) || c.document.includes(q) || (c.email || "").toLowerCase().includes(q)
    );
  }, [customers, query]);

  const openNew = () => { setEditTarget(null); setForm(empty); setFormOpen(true); };
  const openEdit = (c: Customer) => {
    setEditTarget(c);
    setForm({ name: c.name, document: c.document, phone: c.phone || "", email: c.email || "", notes: c.notes || "" });
    setFormOpen(true);
  };

  const save = () => {
    if (!form.name.trim() || !form.document.trim()) {
      toast.error("Nombre y documento son obligatorios");
      return;
    }
    if (editTarget) {
      updateCustomer(editTarget.id, form);
      toast.success("Cliente actualizado");
    } else {
      addCustomer(form);
      toast.success("Cliente creado");
    }
    setFormOpen(false);
  };

  const customerSales = (id: string) => sales.filter((s) => s.customerId === id);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">Base de pacientes y compradores frecuentes.</p>
        </div>
        <Button onClick={openNew} className="bg-gradient-primary"><UserPlus className="h-4 w-4 mr-1" /> Nuevo cliente</Button>
      </div>

      <Card className="p-3 shadow-card">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar por nombre, documento o correo…" className="pl-9" />
        </div>
      </Card>

      <Card className="overflow-hidden shadow-card">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="text-left p-3">Cliente</th>
              <th className="text-left p-3">Documento</th>
              <th className="text-left p-3">Contacto</th>
              <th className="text-right p-3">Compras</th>
              <th className="p-3 w-32"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => {
              const cs = customerSales(c.id);
              const total = cs.reduce((s, x) => s + x.total, 0);
              return (
                <tr key={c.id} className="border-t border-border hover:bg-secondary/30">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/15 text-primary grid place-items-center text-xs font-bold">
                        {c.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                      </div>
                      <p className="font-medium">{c.name}</p>
                    </div>
                  </td>
                  <td className="p-3 font-mono text-xs">{c.document}</td>
                  <td className="p-3 text-xs">
                    {c.phone && <span className="block">{c.phone}</span>}
                    {c.email && <span className="text-muted-foreground">{c.email}</span>}
                  </td>
                  <td className="p-3 text-right">
                    <p className="font-semibold">{cs.length}</p>
                    <p className="text-xs text-muted-foreground">S/ {total.toFixed(2)}</p>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setViewTarget(c)}><Eye className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(c)}><Pencil className="h-4 w-4" /></Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => setDelTarget(c)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-sm text-muted-foreground">Sin clientes.</td></tr>
            )}
          </tbody>
        </table>
      </Card>

      {/* Form */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editTarget ? "Editar cliente" : "Nuevo cliente"}</DialogTitle></DialogHeader>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2"><Label>Nombre completo</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><Label>Documento</Label><Input value={form.document} onChange={(e) => setForm({ ...form, document: e.target.value })} /></div>
            <div><Label>Teléfono</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="col-span-2"><Label>Correo</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div className="col-span-2"><Label>Notas</Label><Textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button className="bg-gradient-primary" onClick={save}>{editTarget ? "Guardar" : "Crear"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Detail */}
      <Sheet open={!!viewTarget} onOpenChange={(v) => !v && setViewTarget(null)}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {viewTarget && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2"><User className="h-5 w-5 text-primary" /> {viewTarget.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-5 space-y-2 text-sm">
                <p className="flex items-center gap-2"><CreditCard className="h-4 w-4 text-muted-foreground" /> {viewTarget.document}</p>
                {viewTarget.phone && <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {viewTarget.phone}</p>}
                {viewTarget.email && <p className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {viewTarget.email}</p>}
                {viewTarget.notes && <p className="text-muted-foreground italic mt-2">{viewTarget.notes}</p>}
              </div>
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-2">Historial de compras</h3>
                <div className="space-y-2">
                  {customerSales(viewTarget.id).length === 0 && (
                    <p className="text-xs text-muted-foreground">Sin compras registradas.</p>
                  )}
                  {customerSales(viewTarget.id).map((s) => (
                    <Card key={s.id} className="p-3 text-sm">
                      <div className="flex justify-between">
                        <span className="font-medium">#{s.id.slice(-5)}</span>
                        <span className="font-semibold">S/ {s.total.toFixed(2)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleString()} • {s.items.length} ítems</p>
                    </Card>
                  ))}
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDialog
        open={!!delTarget}
        onOpenChange={(v) => !v && setDelTarget(null)}
        title="Eliminar cliente"
        description={`Se eliminará "${delTarget?.name}".`}
        destructive
        confirmLabel="Eliminar"
        onConfirm={() => { if (delTarget) { deleteCustomer(delTarget.id); toast.success("Cliente eliminado"); setDelTarget(null); } }}
      />
    </div>
  );
}
