import { useState } from 'react'

interface IngresoForm { producto_id: string; cantidad: string; proveedor_id: string; fecha: string }

const productosDemo = [
  { id: '1', nombre: 'Paracetamol 500mg' },
  { id: '2', nombre: 'Amoxicilina 500mg' },
  { id: '3', nombre: 'Ibuprofeno 400mg' },
]

const proveedoresDemo = [
  { id: '1', nombre: 'Farma Perú SAC' },
  { id: '2', nombre: 'MedDistrib EIRL' },
]

const historialDemo = [
  { id: 1, producto: 'Paracetamol 500mg', cantidad: 100, proveedor: 'Farma Perú SAC', fecha: '2025-04-28', usuario: 'Admin' },
  { id: 2, producto: 'Amoxicilina 500mg', cantidad: 50, proveedor: 'MedDistrib EIRL', fecha: '2025-04-27', usuario: 'Admin' },
]

export default function Ingresos() {
  const [form, setForm] = useState<IngresoForm>({ producto_id: '', cantidad: '', proveedor_id: '', fecha: new Date().toISOString().split('T')[0] })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.producto_id || !form.cantidad || !form.proveedor_id) return alert('Completa todos los campos')
    // Aquí irá POST /api/inventario/ingresos
    alert(`Ingreso registrado: ${form.cantidad} unidades de producto #${form.producto_id}`)
    setForm({ producto_id: '', cantidad: '', proveedor_id: '', fecha: new Date().toISOString().split('T')[0] })
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Ingresos de Inventario</h1>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 32 }}>Registra la llegada de mercadería del proveedor</p>

      {/* Formulario */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, padding: 24, marginBottom: 40, maxWidth: 560 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Nuevo ingreso</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, textTransform: 'uppercase', fontWeight: 500 }}>Producto</label>
            <select name="producto_id" value={form.producto_id} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
              <option value="">Selecciona un producto</option>
              {productosDemo.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, textTransform: 'uppercase', fontWeight: 500 }}>Cantidad ingresada</label>
            <input name="cantidad" type="number" min="1" value={form.cantidad} onChange={handleChange} placeholder="Ej: 100" style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, textTransform: 'uppercase', fontWeight: 500 }}>Proveedor</label>
            <select name="proveedor_id" value={form.proveedor_id} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
              <option value="">Selecciona un proveedor</option>
              {proveedoresDemo.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, textTransform: 'uppercase', fontWeight: 500 }}>Fecha</label>
            <input name="fecha" type="date" value={form.fecha} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
          </div>
          <button type="submit" style={{ padding: '12px', background: '#0f4c35', color: 'white', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Registrar ingreso
          </button>
        </form>
      </div>

      {/* Historial */}
      <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Historial de ingresos</h2>
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Producto', 'Cantidad', 'Proveedor', 'Fecha', 'Registrado por'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {historialDemo.map((h, i) => (
              <tr key={h.id} style={{ borderBottom: i < historialDemo.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <td style={{ padding: '14px 16px', fontWeight: 500 }}>{h.producto}</td>
                <td style={{ padding: '14px 16px', color: '#16a34a', fontWeight: 600 }}>+{h.cantidad}</td>
                <td style={{ padding: '14px 16px' }}>{h.proveedor}</td>
                <td style={{ padding: '14px 16px', color: '#888' }}>{h.fecha}</td>
                <td style={{ padding: '14px 16px', color: '#888' }}>{h.usuario}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}