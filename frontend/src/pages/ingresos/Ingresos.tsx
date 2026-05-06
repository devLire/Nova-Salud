import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import IngresoItem from './components/IngresoItem'
import { getIngresos, createIngreso } from '@/actions/ingresos.action.ts'
import { getProductos } from '@/actions/productos.action.ts'
import { getProveedores } from '@/actions/proveedores.action.ts'
import type { Datum } from '@/infrastructure/interfaces/responses/ingresos.response'

export interface IngresoForm {
  id_producto: string;
  cantidad_ingresada: string;
  id_proveedor: string;
  fecha_ingreso: string;
}

export default function Ingresos() {
  const queryClient = useQueryClient()

  const [form, setForm] = useState<IngresoForm>({
    id_producto: '',
    cantidad_ingresada: '',
    id_proveedor: '',
    fecha_ingreso: new Date().toISOString().split('T')[0]
  })

  // 3. Tipamos el historial usando la interfaz Datum de tu API
  const { data: historial = [] as Datum[] } = useQuery({ queryKey: ['ingresos'], queryFn: getIngresos })
  const { data: productos = [] } = useQuery({ queryKey: ['productos'], queryFn: getProductos })
  const { data: proveedores = [] } = useQuery({ queryKey: ['proveedores'], queryFn: getProveedores })

  const { mutate: addIngreso } = useMutation({
    mutationFn: createIngreso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ingresos'] })
      queryClient.invalidateQueries({ queryKey: ['productos'] })
      setForm({ id_producto: '', cantidad_ingresada: '', id_proveedor: '', fecha_ingreso: new Date().toISOString().split('T')[0] })
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.id_producto || !form.cantidad_ingresada) return alert('Completa los campos requeridos')

    // 4. Transformamos los strings a numbers para que TypeScript y la API sean felices
    addIngreso({
      id_producto: Number(form.id_producto),
      cantidad_ingresada: Number(form.cantidad_ingresada),
      id_usuario: 1, // <-- OJO: Aquí debes poner el ID del usuario logueado
      fecha_ingreso: new Date(form.fecha_ingreso) as any, // Parseamos la fecha
      // id_proveedor: Number(form.id_proveedor) // Descomenta esto si tu API final sí pide el proveedor
    })
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
            <select name="id_producto" value={form.id_producto} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
              <option value="">Selecciona un producto</option>
              {Array.isArray(productos) && productos.map((p: any) => <option key={p.id_producto || p.id} value={p.id_producto || p.id}>{p.nombre}</option>)}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, textTransform: 'uppercase', fontWeight: 500 }}>Cantidad ingresada</label>
            <input name="cantidad_ingresada" type="number" min="1" value={form.cantidad_ingresada} onChange={handleChange} placeholder="Ej: 100" style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
          </div>

          {/* Mantuve el proveedor visualmente, pero si el backend ya lo infiere por el producto, puedes borrar este bloque */}
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, textTransform: 'uppercase', fontWeight: 500 }}>Proveedor</label>
            <select name="id_proveedor" value={form.id_proveedor} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
              <option value="">Selecciona un proveedor</option>
              {Array.isArray(proveedores) && proveedores.map((p: any) => <option key={p.id_proveedor || p.id} value={p.id_proveedor || p.id}>{p.nombre_empresa}</option>)}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 6, textTransform: 'uppercase', fontWeight: 500 }}>Fecha</label>
            <input name="fecha_ingreso" type="date" value={form.fecha_ingreso} onChange={handleChange} style={{ width: '100%', padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, boxSizing: 'border-box' }} />
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
          {historial?.map((h: Datum, i: number) => (
            <IngresoItem
              key={h.id_inventario}
              ingreso={h}
              isLast={i === historial.length - 1}
            />
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}