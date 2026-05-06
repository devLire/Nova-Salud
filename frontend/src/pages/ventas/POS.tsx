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
    <div className="flex gap-6 text-gray-100 h-[calc(100vh-96px)]">
      {/* Panel izquierdo: buscador de productos */}
      <div className="flex-1 flex flex-col gap-4 overflow-hidden">
        <div>
          <h1 className="text-[22px] font-semibold mb-1 text-white">Punto de Venta</h1>
          <p className="text-[13px] text-gray-400">Busca por nombre o código de barras</p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="🔍  Buscar producto o escanear código..."
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            className="w-full px-4 py-3.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-sm text-gray-200 outline-none focus:ring-2 focus:ring-[#2ecc71]/20 focus:border-[#2ecc71] transition-all"
            autoFocus
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar flex flex-col gap-2">
          {productosFiltrados.map(p => (
            <PosProductItem key={p.id} producto={p} onAgregar={agregarAlCarrito} />
          ))}
        </div>
      </div>

      {/* Panel derecho: carrito */}
      <div className="w-[360px] flex flex-col border border-white/10 rounded-xl bg-[#121212] overflow-hidden shadow-2xl">
        <div className="p-5 pb-4 border-b border-white/10 bg-white/5">
          <h2 className="text-base font-semibold text-white uppercase tracking-wider text-xs">Detalle de venta</h2>
        </div>

        <div className="flex-1 overflow-y-auto p-5 py-3 flex flex-col gap-2.5 custom-scrollbar">
          {carrito.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full opacity-30">
              <p className="text-sm mt-2 text-center">Agrega productos al carrito</p>
            </div>
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

        <div className="p-5 border-t border-white/10 bg-white/5 flex flex-col gap-3">
          <div className="flex justify-between items-center text-xl font-bold mb-1">
            <span className="text-gray-400">Total</span>
            <span className="text-[#2ecc71]">S/ {total.toFixed(2)}</span>
          </div>

          <select
            value={metodoPago}
            onChange={e => setMetodoPago(e.target.value)}
            className="w-full px-3 py-2.5 bg-[#0f0f0f] border border-white/10 rounded-lg text-sm text-gray-200 outline-none focus:ring-2 focus:ring-[#2ecc71]/20 focus:border-[#2ecc71] [color-scheme:dark]"
          >
            <option className="bg-[#1a1a1a]">Efectivo</option>
            <option className="bg-[#1a1a1a]">Tarjeta</option>
            <option className="bg-[#1a1a1a]">Yape / Plin</option>
          </select>

          <button
            onClick={cobrar}
            className="w-full py-4 bg-[#0f4c35] hover:bg-[#145a40] text-white rounded-xl text-base font-bold transition-all active:scale-[0.98] shadow-lg border border-white/5"
          >
            Cobrar S/ {total.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  );
}