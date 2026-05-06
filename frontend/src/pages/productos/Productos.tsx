import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import Product from './components/Product'
import { getProductos } from '@/actions/productos.action.ts'

export default function Productos() {
  const [inputValue, setInputValue] = useState('')

  const [busqueda, setBusqueda] = useState('')

  const [pagina, setPagina] = useState(1)
  const limite = 10

  useEffect(() => {
    const handler = setTimeout(() => {
      setBusqueda(inputValue)
      setPagina(1)
    }, 300)

    return () => {
      clearTimeout(handler)
    }
  }, [inputValue])

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['productos', pagina, busqueda],
    queryFn: () => getProductos({
      limit: limite,
      page: pagina,
      search: busqueda
    }),
    placeholderData: (previousData) => previousData,
  })

  const productos = data?.data || []
  const pagination = data?.pagination

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

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre o código..."
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          className="w-[300px] px-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-lg text-sm text-gray-200 outline-none focus:ring-2 focus:ring-[#2ecc71]/20 focus:border-[#2ecc71] transition-all"
        />
        {isFetching && (
          <span className="absolute left-[315px] top-3 text-xs text-gray-400 animate-pulse">
            Buscando...
          </span>
        )}
      </div>

      <div className={`border border-white/10 rounded-xl overflow-hidden bg-[#121212] shadow-xl transition-opacity duration-200 ${isFetching ? 'opacity-60' : 'opacity-100'}`}>

        {isLoading && productos.length === 0 ? (
          <div className="p-8 text-center text-gray-400">Cargando catálogo...</div>
        ) : productos.length === 0 ? (
          <div className="p-8 text-center text-gray-400">No se encontraron productos.</div>
        ) : (
          <>
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
              {productos.map((p: any, i: number) => (
                <Product
                  key={p.id_producto}
                  producto={p}
                  isLast={i === productos.length - 1}
                />
              ))}
              </tbody>
            </table>

            {/* CONTROLES DE PAGINACIÓN */}
            <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-t border-white/10">
              <span className="text-xs text-gray-400">
                Mostrando página <span className="text-white font-medium">{pagination?.page || 1}</span> de <span className="text-white font-medium">{Math.ceil((pagination?.total || 0) / limite) || 1}</span>
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => setPagina(prev => Math.max(prev - 1, 1))}
                  disabled={!pagination?.prev}
                  className="px-4 py-2 text-xs font-semibold rounded-md border border-white/10 bg-[#1a1a1a] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Anterior
                </button>
                <button
                  onClick={() => setPagina(prev => prev + 1)}
                  disabled={!pagination?.next}
                  className="px-4 py-2 text-xs font-semibold rounded-md border border-white/10 bg-[#1a1a1a] text-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/5 transition-colors cursor-pointer"
                >
                  Siguiente
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}