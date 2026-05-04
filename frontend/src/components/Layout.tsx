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
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside style={{ width: 220, background: '#0f4c35', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        <p style={{ color: '#fff', fontWeight: 600, fontSize: 18, marginBottom: 32 }}>Nova Salud</p>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {navItems.map(item => (
            <NavLink key={item.path} to={item.path}
              style={({ isActive }) => ({
                padding: '10px 14px', borderRadius: 8, fontSize: 14,
                color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                textDecoration: 'none'
              })}>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <button onClick={logout}
          style={{ background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.7)', padding: '10px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 14, textAlign: 'left' }}>
          Cerrar sesión
        </button>
      </aside>

      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  )
}