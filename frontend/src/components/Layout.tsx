import { Outlet, NavLink } from 'react-router-dom'
import {useAuthStore} from "@/stores/auth/useAuthStore.ts";

const navItems = [
  { path: '/dashboard',           label: 'Dashboard' },
  { path: '/pos',                 label: 'Punto de Venta' },
  { path: '/productos',           label: 'Productos' },
  { path: '/inventario/ingresos', label: 'Ingresos' },
  { path: '/proveedores',         label: 'Proveedores' },
  { path: '/categorias',          label: 'Categorías' },
  { path: '/reportes',            label: 'Reportes' },
]

export default function Layout() {
  const { logout } = useAuthStore();

  return (
    <div className="flex h-screen overflow-hidden bg-[#080808]">
      <aside className="w-[260px] h-screen bg-[#0f4c35] p-6 flex flex-col shadow-2xl border-r border-white/5 shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="h-9 w-9 rounded-xl bg-[#2ecc71] flex items-center justify-center font-black text-[#0f4c35] text-xl">
            +
          </div>
          <p className="text-white font-bold text-xl tracking-tight">Nova Salud</p>
        </div>

        <nav className="flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => `
              px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
              ${isActive
                ? 'bg-white/15 text-white shadow-lg'
                : 'text-white/60 hover:text-white hover:bg-white/5'
              }
            `}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="pt-6 mt-auto border-t border-white/10">
          <button
            onClick={logout}
            className="w-full px-4 py-3 bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-white/70 rounded-xl text-sm font-bold transition-all cursor-pointer border border-white/5 flex items-center justify-center gap-2"
          >
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 h-screen overflow-y-auto bg-[#080808] custom-scrollbar">
        <div className="max-w-[1200px] mx-auto p-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}