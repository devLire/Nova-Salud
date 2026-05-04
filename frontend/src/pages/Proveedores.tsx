import { useState } from 'react'

interface Proveedor { id: number; nombre_empresa: string; contacto: string; telefono: string }

const proveedoresDemo: Proveedor[] = [
  { id: 1, nombre_empresa: 'Farma Perú SAC', contacto: 'Juan Pérez', telefono: '987654321' },
  { id: 2, nombre_empresa: 'MedDistrib EIRL', contacto: 'Ana García', telefono: '976543210' },
]

export default function Proveedores() {
  const [proveedores, setProveedores] = useState(proveedoresDemo)
  const [form, setForm] = useState({ nombre_empresa: '', contacto: '', telefono: '' })
  const [mostrarForm, setMostrarForm] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const nuevo = { id: Date.now(), ...form }
    setProveedores(prev => [...prev, nuevo])
    setForm({ nombre_empresa: '', contacto: '', telefono: '' })
    setMostrarForm(false)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Proveedores</h1>
          <p style={{ color: '#888', fontSize: 13 }}>Gestión de proveedores de la botica</p>
        </div>
        <button onClick={() => setMostrarForm(!mostrarForm)} style={{ padding: '10px 20px', background: '#0f4c35', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
          + Agregar proveedor
        </button>
      </div>

      {mostrarForm && (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 24, maxWidth: 480 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, marginBottom: 16 }}>Nuevo proveedor</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[['nombre_empresa', 'Nombre de empresa'], ['contacto', 'Persona de contacto'], ['telefono', 'Teléfono']].map(([name, label]) => (
              <div key={name}>
                <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 5, textTransform: 'uppercase', fontWeight: 500 }}>{label}</label>
                <input name={name} value={(form as any)[name]} onChange={e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} required />
              </div>
            ))}
            <button type="submit" style={{ padding: 12, background: '#0f4c35', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>Guardar</button>
          </form>
        </div>
      )}

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Empresa', 'Contacto', 'Teléfono', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {proveedores.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < proveedores.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <td style={{ padding: '14px 16px', fontWeight: 500 }}>{p.nombre_empresa}</td>
                <td style={{ padding: '14px 16px' }}>{p.contacto}</td>
                <td style={{ padding: '14px 16px', color: '#888' }}>{p.telefono}</td>
                <td style={{ padding: '14px 16px' }}>
                  <button style={{ marginRight: 8, padding: '6px 12px', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', background: 'white', fontSize: 12 }}>Editar</button>
                  <button onClick={() => setProveedores(prev => prev.filter(x => x.id !== p.id))} style={{ padding: '6px 12px', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer', background: '#fef2f2', color: '#dc2626', fontSize: 12 }}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}