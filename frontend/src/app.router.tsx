import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard';
import POS from './pages/ventas/POS';
import Productos from './pages/productos/Productos';
import Ingresos from './pages/ingresos/Ingresos';
import Proveedores from './pages/proveedores/Proveedores';
import Categorias from './pages/categorias/Categorias';
import Reportes from './pages/reportes/Reportes';
import Layout from './components/Layout';
import { AuthenticatedRoute, NotAuthenticatedRoute, AdminRoute } from './components/routes/ProtectedRoutes';

export const appRouter = createBrowserRouter([
  // Rutas públicas
  {
    path: '/login',
    element: (
      <NotAuthenticatedRoute>
        <Login />
      </NotAuthenticatedRoute>
    ),
  },

  // Rutas privadas
  {
    path: '/',
    element: (
      <AuthenticatedRoute>
        <Layout />
      </AuthenticatedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'pos',
        element: <POS />,
      },
      {
        path: 'productos',
        element: <Productos />,
      },
      {
        path: 'inventario/ingresos',
        element: <Ingresos />,
      },
      {
        path: 'proveedores',
        element: <Proveedores />,
      },
      {
        path: 'categorias',
        element: <Categorias />,
      },
      {
        path: 'reportes',
        element: (
          <AdminRoute>
            <Reportes />
          </AdminRoute>
        ),
      },
    ],
  },

  // Fallback
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);
