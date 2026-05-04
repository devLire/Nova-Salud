import { Navigate, Outlet } from 'react-router-dom'

export default function PrivateRoute() {
  // Por ahora revisa si hay un token en localStorage
  // Cuando conectes el backend real, valida aquí el JWT
  const token = localStorage.getItem('token')
  return token ? <Outlet /> : <Navigate to="/login" replace />
}