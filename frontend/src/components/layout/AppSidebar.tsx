import { NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, ShoppingCart, Bell, Pill, Users, Receipt } from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";
import { usePharmacyStore } from "@/store/usePharmacyStore";
import { Badge } from "@/components/ui/badge";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Punto de Venta", url: "/ventas", icon: ShoppingCart },
  { title: "Inventario", url: "/inventario", icon: Package },
  { title: "Clientes", url: "/clientes", icon: Users },
  { title: "Historial", url: "/historial", icon: Receipt },
  { title: "Alertas", url: "/alertas", icon: Bell },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { pathname } = useLocation();
  const alerts = usePharmacyStore((s) => s.alerts);

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary shadow-elegant">
            <Pill className="h-5 w-5 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight">Nova Salud</p>
              <p className="text-[11px] text-muted-foreground">Sistema de gestión</p>
            </div>
          )}
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Operaciones</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                const showBadge = item.url === "/alertas" && alerts.length > 0;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active}>
                      <NavLink to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span className="flex-1">{item.title}</span>}
                        {!collapsed && showBadge && (
                          <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">{alerts.length}</Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
