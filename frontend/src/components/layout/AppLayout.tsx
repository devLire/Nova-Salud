import { useEffect, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Bell, Search, Settings, LogOut, User, History, ShieldCheck, RotateCcw, Moon, Sun } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usePharmacyStore } from "@/store/usePharmacyStore";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from "@/components/ui/command";

export default function AppLayout() {
  const { alerts, sales, products, resetDemo } = usePharmacyStore();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [dark, setDark] = useState<boolean>(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const recent = useMemo(() => sales.slice(0, 8), [sales]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-subtle">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-14 flex items-center gap-3 border-b border-border bg-card/80 backdrop-blur px-3 sticky top-0 z-30">
            <SidebarTrigger />
            <button
              onClick={() => setSearchOpen(true)}
              className="relative max-w-md flex-1 hidden sm:flex items-center gap-2 px-3 h-9 rounded-md bg-secondary/60 text-sm text-muted-foreground hover:bg-secondary transition"
            >
              <Search className="h-4 w-4" />
              Buscar producto, venta, cliente…
              <kbd className="ml-auto text-[10px] bg-card border border-border rounded px-1.5 py-0.5">⌘K</kbd>
            </button>

            <div className="ml-auto flex items-center gap-1">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {alerts.length > 0 && (
                      <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-critical animate-pulse" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Alertas activas
                    <span className="text-xs text-muted-foreground">{alerts.length}</span>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {alerts.length === 0 && (
                    <p className="text-xs text-muted-foreground px-3 py-4 text-center">Sin alertas. Inventario óptimo ✓</p>
                  )}
                  <div className="max-h-72 overflow-y-auto">
                    {alerts.slice(0, 6).map((a) => (
                      <DropdownMenuItem key={a.id} onClick={() => navigate("/alertas")} className="flex flex-col items-start gap-0">
                        <div className="flex items-center gap-2 w-full">
                          <span className={`h-2 w-2 rounded-full ${a.level === "low" ? "bg-warning" : "bg-critical"}`} />
                          <span className="text-sm font-medium flex-1 truncate">{a.message}</span>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/alertas")} className="justify-center text-primary font-medium">
                    Ver todas las alertas
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* History */}
              <Button variant="ghost" size="icon" onClick={() => setHistoryOpen(true)} title="Actividad reciente">
                <History className="h-5 w-5" />
              </Button>

              {/* Settings */}
              <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)} title="Configuración">
                <Settings className="h-5 w-5" />
              </Button>

              {/* User */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 pl-2 ml-1 border-l border-border hover:opacity-80">
                    <div className="h-8 w-8 rounded-full bg-gradient-primary text-primary-foreground grid place-items-center text-sm font-semibold">FA</div>
                    <div className="hidden md:block leading-tight text-left">
                      <p className="text-xs font-medium">Farm. Andrea R.</p>
                      <p className="text-[10px] text-muted-foreground">Cajera turno A</p>
                    </div>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast("Perfil del usuario", { description: "Pantalla en construcción" })}>
                    <User className="h-4 w-4 mr-2" /> Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                    <Settings className="h-4 w-4 mr-2" /> Preferencias
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast("Sesión segura activa", { icon: <ShieldCheck className="h-4 w-4" /> })}>
                    <ShieldCheck className="h-4 w-4 mr-2" /> Seguridad
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => toast.success("Sesión cerrada (simulada)")} className="text-destructive">
                    <LogOut className="h-4 w-4 mr-2" /> Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <main className="flex-1 p-4 md:p-6">
            <Outlet />
          </main>
        </div>
      </div>

      {/* Settings sheet */}
      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Configuración</SheetTitle>
            <SheetDescription>Personaliza el comportamiento del sistema.</SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <Label>Modo oscuro</Label>
                <p className="text-xs text-muted-foreground">Reduce fatiga visual en turnos nocturnos.</p>
              </div>
              <div className="flex items-center gap-2">
                {dark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                <Switch checked={dark} onCheckedChange={setDark} />
              </div>
            </div>
            <div className="border-t border-border pt-4">
              <Label>Datos del sistema</Label>
              <p className="text-xs text-muted-foreground mb-2">{products.length} productos · {sales.length} ventas registradas.</p>
              <Button variant="outline" className="w-full" onClick={() => { resetDemo(); toast.success("Datos restablecidos"); }}>
                <RotateCcw className="h-4 w-4 mr-2" /> Restablecer datos demo
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* History sheet */}
      <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Actividad reciente</SheetTitle>
            <SheetDescription>Últimas ventas registradas.</SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            {recent.length === 0 && <p className="text-sm text-muted-foreground">Sin actividad aún.</p>}
            {recent.map((s) => (
              <button key={s.id} onClick={() => { setHistoryOpen(false); navigate("/historial"); }}
                className="w-full text-left p-3 rounded-md border border-border hover:border-primary transition">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">#{s.id.slice(-5)}</span>
                  <span className="font-semibold">S/ {s.total.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleString()} · {s.items.length} ítems · {s.durationSec}s</p>
              </button>
            ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Global search command */}
      <CommandPalette open={searchOpen} setOpen={setSearchOpen} />
    </SidebarProvider>
  );
}

function CommandPalette({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  const navigate = useNavigate();
  const { products, customers } = usePharmacyStore();
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm grid place-items-start pt-24" onClick={() => setOpen(false)}>
      <div className="w-full max-w-xl mx-auto" onClick={(e) => e.stopPropagation()}>
        <Command className="rounded-xl border shadow-elegant">
          <CommandInput placeholder="Buscar productos, clientes, módulos…" />
          <CommandList>
            <CommandEmpty>Sin resultados.</CommandEmpty>
            <CommandGroup heading="Módulos">
              {[
                { label: "Ir al Dashboard", url: "/" },
                { label: "Punto de venta", url: "/ventas" },
                { label: "Inventario", url: "/inventario" },
                { label: "Clientes", url: "/clientes" },
                { label: "Historial de ventas", url: "/historial" },
                { label: "Alertas", url: "/alertas" },
              ].map((m) => (
                <CommandItem key={m.url} onSelect={() => { navigate(m.url); setOpen(false); }}>{m.label}</CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Productos">
              {products.slice(0, 6).map((p) => (
                <CommandItem key={p.id} onSelect={() => { navigate("/inventario"); setOpen(false); }}>
                  {p.name} <span className="ml-auto text-xs text-muted-foreground">{p.sku}</span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandGroup heading="Clientes">
              {customers.slice(0, 5).map((c) => (
                <CommandItem key={c.id} onSelect={() => { navigate("/clientes"); setOpen(false); }}>
                  {c.name} <span className="ml-auto text-xs text-muted-foreground">{c.document}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
    </div>
  );
}
