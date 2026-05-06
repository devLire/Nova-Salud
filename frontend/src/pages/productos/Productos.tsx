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
    <div className="text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold mb-1 text-white">Productos</h1>
          <p className="text-[13px] text-gray-400">Catálogo de medicamentos e inventario</p>
        </div>
        <button className="px-5 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-[#0f4c35] rounded-lg font-bold transition-colors cursor-pointer">
          + Agregar producto
        </button>
      </div>

      {/* Buscador optimizado para tema oscuro */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          className="w-[300px] px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm text-gray-200 outline-none focus:ring-2 focus:ring-[#2ecc71]/20 focus:border-[#2ecc71] transition-all"
        />
      </div>

      <div className="border border-white/10 rounded-xl overflow-hidden bg-[#121212] shadow-xl">
        <table className="w-full border-collapse text-sm">
          <thead>
          <tr className="bg-white/5 border-b border-white/10">
            {[
              'Nombre', 'Código', 'Precio', 'Stock actual',
              'Stock mínimo', 'Categoría', 'Estado', 'Acciones'
            ].map(h => (
              <th
                key={h}
                className="px-4 py-4 text-center font-medium text-gray-400 uppercase text-[11px] tracking-wider"
              >
                {h}
              </th>
            ))}
          </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
          {filtrados.map((p: any, i: number) => (
            <Product
              key={p.id_producto}
              producto={p}
              isLast={i === filtrados.length - 1}
            />
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}