import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import POS from './pages/POS';
import Productos from './pages/Productos';
import Ingresos from './pages/Ingresos';
import Proveedores from './pages/Proveedores';
import Categorias from './pages/Categorias';
import Reportes from './pages/Reportes';
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
