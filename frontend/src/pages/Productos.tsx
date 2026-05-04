import { useState } from 'react'

interface Producto { id: number; nombre: string; codigo_barras: string; precio_venta: number; stock_actual: number; stock_minimo: number; categoria: string }

const productosDemo: Producto[] = [
  { id: 1, nombre: 'Paracetamol 500mg', codigo_barras: '001', precio_venta: 0.5, stock_actual: 3, stock_minimo: 10, categoria: 'Analgésicos' },
  { id: 2, nombre: 'Amoxicilina 500mg', codigo_barras: '002', precio_venta: 1.2, stock_actual: 50, stock_minimo: 15, categoria: 'Antibióticos' },
  { id: 3, nombre: 'Ibuprofeno 400mg', codigo_barras: '003', precio_venta: 0.8, stock_actual: 5, stock_minimo: 20, categoria: 'Analgésicos' },
]

export default function Productos() {
  const [busqueda, setBusqueda] = useState('')
  const [productos] = useState<Producto[]>(productosDemo)

  const filtrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_barras.includes(busqueda)
  )

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
            {filtrados.map((p, i) => (
              <tr key={p.id} style={{ borderBottom: i < filtrados.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <td style={{ padding: '14px 16px', fontWeight: 500 }}>{p.nombre}</td>
                <td style={{ padding: '14px 16px', color: '#888' }}>{p.codigo_barras}</td>
                <td style={{ padding: '14px 16px' }}>S/ {p.precio_venta.toFixed(2)}</td>
                <td style={{ padding: '14px 16px', color: p.stock_actual < p.stock_minimo ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{p.stock_actual}</td>
                <td style={{ padding: '14px 16px', color: '#888' }}>{p.stock_minimo}</td>
                <td style={{ padding: '14px 16px' }}>{p.categoria}</td>
                <td style={{ padding: '14px 16px' }}>
                  {p.stock_actual < p.stock_minimo
                    ? <span style={{ background: '#fef2f2', color: '#dc2626', borderRadius: 20, padding: '4px 10px', fontSize: 12 }}>⚠ Stock bajo</span>
                    : <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: 20, padding: '4px 10px', fontSize: 12 }}>✓ OK</span>
                  }
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button style={{ marginRight: 8, padding: '6px 12px', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', background: 'white', fontSize: 12 }}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}