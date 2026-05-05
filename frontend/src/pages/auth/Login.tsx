import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {useAuthStore} from "@/stores/auth/useAuthStore.ts";

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isPosting, setIsPosting] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }

    setIsPosting(true)
    const isValid = await login(email, password)

    if (isValid) {
      navigate('/dashboard')
      return
    }

    setError('Correo y/o contraseña no válidos')
    setIsPosting(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Panel izquierdo */}
      <div style={{ flex: 1, background: '#0f4c35', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '40px 36px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: '#2ecc71', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#0f4c35', fontWeight: 900, fontSize: 18 }}>+</span>
          </div>
          <span style={{ color: '#fff', fontWeight: 700, fontSize: 20 }}>Nova Salud</span>
        </div>
        <div>
          <h2 style={{ color: '#fff', fontSize: 28, marginBottom: 12 }}>Sistema de gestión farmacéutica</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.6 }}>
            Control de inventario, ventas y alertas de stock en tiempo real.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {['Alertas de stock automáticas', 'Registro de ventas por cajero', 'Panel de inventario en vivo'].map(txt => (
            <div key={txt} style={{ background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: '8px 14px', fontSize: 12, color: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#2ecc71', display: 'inline-block' }} />
              {txt}
            </div>
          ))}
        </div>
      </div>

      {/* Panel derecho */}
      <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '48px 40px' }}>
        <h1 style={{ fontSize: 26, marginBottom: 4 }}>Bienvenido</h1>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 32 }}>Ingresa tus credenciales para continuar</p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: 13 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Correo electrónico</label>
            <input
              type="email"
              placeholder="usuario@novasalud.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label style={{ fontSize: 12, fontWeight: 500, color: '#888', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Contraseña</label>
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={isPosting}
            style={{ width: '100%', padding: 12, background: isPosting ? '#6b7280' : '#0f4c35', color: '#fff', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: isPosting ? 'not-allowed' : 'pointer' }}
          >
            {isPosting ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}