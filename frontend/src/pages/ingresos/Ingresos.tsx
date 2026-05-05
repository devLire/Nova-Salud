import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import IngresoItem from './components/IngresoItem'
import { getIngresos, createIngreso } from '@/actions/ingresos.action.ts'
import { getProductos } from '@/actions/productos.action.ts'
import { getProveedores } from '@/actions/proveedores.action.ts'

export interface IngresoForm { producto_id: string; cantidad: string; proveedor_id: string; fecha: string }

export default function Ingresos() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<IngresoForm>({ producto_id: '', cantidad: '', proveedor_id: '', fecha: new Date().toISOString().split('T')[0] })

  const { data: historial = [] } = useQuery({ queryKey: ['ingresos'], queryFn: getIngresos })
  const { data: productos = [] } = useQuery({ queryKey: ['productos'], queryFn: getProductos })
  const { data: proveedores = [] } = useQuery({ queryKey: ['proveedores'], queryFn: getProveedores })

  const { mutate: addIngreso } = useMutation({
    mutationFn: createIngreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingresos'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      setForm({ producto_id: '', cantidad: '', proveedor_id: '', fecha: new Date().toISOString().split('T')[0] })
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.producto_id || !form.cantidad || !form.proveedor_id) return alert('Completa todos los campos')
    addIngreso(form)
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
              {productos?.map((p: any) => <option key={p.id} value={p.id}>{p.nombre}</option>)}
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
              {proveedores?.map((p: any) => <option key={p.id} value={p.id}>{p.nombre_empresa}</option>)}
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
            {historial?.map((h: any, i: number) => (
              <IngresoItem key={h.id} ingreso={h} isLast={i === historial.length - 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}