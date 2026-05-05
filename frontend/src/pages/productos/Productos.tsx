import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Product from './components/Product'
import { getProductos } from '../../actions/productos.action'

export interface Producto { id: number; nombre: string; codigo_barras: string; precio_venta: number; stock_actual: number; stock_minimo: number; categoria: string }

export default function Productos() {
  const [busqueda, setBusqueda] = useState('')

  const { data: productos = [], isLoading } = useQuery({
    queryKey: ['productos'],
    queryFn: getProductos,
  })

  const filtrados = productos.filter((p: any) =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_barras.includes(busqueda)
  )

  if (isLoading) return <p>Cargando productos...</p>

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Productos</h1>
          <p style={{ color: '#888', fontSize: 13 }}>Catálogo de medicamentos e inventario</p>
        </div>
        <button style={{ padding: '10px 20px', background: '#0f4c35', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}>
          + Agregar producto
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar por nombre o código..."
        value={busqueda}
        onChange={e => setBusqueda(e.target.value)}
        style={{ padding: '10px 14px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14, width: 300, marginBottom: 20 }}
      />

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['Nombre', 'Código', 'Precio', 'Stock actual', 'Stock mínimo', 'Categoría', 'Estado', 'Acciones'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtrados.map((p: any, i: number) => (
              <Product key={p.id_producto} producto={p} isLast={i === filtrados.length - 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}