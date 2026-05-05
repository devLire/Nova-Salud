import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import ProveedorItem from './components/ProveedorItem'
import { getProveedores, createProveedor } from '@/actions/proveedores.action.ts'

export default function Proveedores() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ nombre_empresa: '', contacto: '', telefono: '' })
  const [mostrarForm, setMostrarForm] = useState(false)

  const { data: proveedores = [], isLoading } = useQuery({
    queryKey: ['proveedores'],
    queryFn: getProveedores,
  })

  const { mutate: create } = useMutation({
    mutationFn: createProveedor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['proveedores'] })
      setMostrarForm(false)
      setForm({ nombre_empresa: '', contacto: '', telefono: '' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    create(form)
  }

  if (isLoading) return <p>Cargando proveedores...</p>

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
            {proveedores.map((p: any, i: number) => (
              <ProveedorItem
                key={p.id_proveedor}
                proveedor={p}
                isLast={i === proveedores.length - 1}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}