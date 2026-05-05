import { useState } from 'react'
import type { Producto } from './components/PosProductItem'
import PosProductItem from './components/PosProductItem'
import PosCartItem from './components/PosCartItem'
import type {ItemCarrito} from './components/PosCartItem'

const productosDemo: Producto[] = [
  { id: 1, nombre: 'Paracetamol 500mg', precio_venta: 0.5, codigo_barras: '001' },
  { id: 2, nombre: 'Ibuprofeno 400mg', precio_venta: 0.8, codigo_barras: '002' },
  { id: 3, nombre: 'Amoxicilina 500mg', precio_venta: 1.2, codigo_barras: '003' },
  { id: 4, nombre: 'Loratadina 10mg', precio_venta: 0.6, codigo_barras: '004' },
  { id: 5, nombre: 'Metformina 500mg', precio_venta: 0.4, codigo_barras: '005' },
]

export default function POS() {
  const [busqueda, setBusqueda] = useState('')
  const [carrito, setCarrito] = useState<ItemCarrito[]>([])
  const [metodoPago, setMetodoPago] = useState('Efectivo')

  const productosFiltrados = productosDemo.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.codigo_barras.includes(busqueda)
  )

  const agregarAlCarrito = (producto: Producto) => {
    setCarrito(prev => {
      const existe = prev.find(i => i.id === producto.id)
      if (existe) return prev.map(i => i.id === producto.id ? { ...i, cantidad: i.cantidad + 1 } : i)
      return [...prev, { ...producto, cantidad: 1 }]
    })
  }

  const cambiarCantidad = (id: number, delta: number) => {
    setCarrito(prev =>
      prev.map(i => i.id === id ? { ...i, cantidad: Math.max(1, i.cantidad + delta) } : i)
    )
  }

  const eliminarItem = (id: number) => setCarrito(prev => prev.filter(i => i.id !== id))

  const total = carrito.reduce((sum, i) => sum + i.precio_venta * i.cantidad, 0)

  const cobrar = () => {
    if (carrito.length === 0) return alert('El carrito está vacío')
    // Aquí irá la llamada a POST /api/ventas con el carrito y método de pago
    alert(`Venta registrada por S/ ${total.toFixed(2)} - ${metodoPago}`)
    setCarrito([])
  }

  return (
    <div style={{ display: 'flex', gap: 24, height: 'calc(100vh - 96px)' }}>
      {/* Panel izquierdo: buscador de productos */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Punto de Venta</h1>
          <p style={{ color: '#888', fontSize: 13 }}>Busca por nombre o código de barras</p>
        </div>
        <input
          type="text"
          placeholder="🔍  Buscar producto o escanear código..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          style={{ padding: '12px 16px', border: '1px solid #ddd', borderRadius: 10, fontSize: 14, width: '100%', boxSizing: 'border-box' }}
          autoFocus
        />
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {productosFiltrados.map(p => (
            <PosProductItem key={p.id} producto={p} onAgregar={agregarAlCarrito} />
          ))}
        </div>
      </div>

      {/* Panel derecho: carrito */}
      <div style={{ width: 360, display: 'flex', flexDirection: 'column', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid #e5e7eb' }}>
          <h2 style={{ fontSize: 16, fontWeight: 600 }}>Detalle de venta</h2>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
          {carrito.length === 0 ? (
            <p style={{ color: '#aaa', textAlign: 'center', marginTop: 40 }}>Agrega productos al carrito</p>
          ) : (
            carrito.map(item => (
              <PosCartItem
                key={item.id}
                item={item}
                onCambiarCantidad={cambiarCantidad}
                onEliminar={eliminarItem}
              />
            ))
          )}
        </div>

        <div style={{ padding: '16px 20px', borderTop: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 18, fontWeight: 700 }}>
            <span>Total</span>
            <span style={{ color: '#0f4c35' }}>S/ {total.toFixed(2)}</span>
          </div>
          <select value={metodoPago} onChange={e => setMetodoPago(e.target.value)} style={{ padding: '10px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}>
            <option>Efectivo</option>
            <option>Tarjeta</option>
            <option>Yape / Plin</option>
          </select>
          <button
            onClick={cobrar}
            style={{ padding: 14, background: '#0f4c35', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}
          >
            Cobrar S/ {total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}