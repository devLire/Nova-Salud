import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import CategoriaItem from './components/CategoriaItem'
import { getCategorias, createCategoria } from '../../actions/categorias.action'

export interface Categoria { id: number; nombre: string; descripcion: string }

export default function Categorias() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ nombre: '', descripcion: '' })
  const [mostrarForm, setMostrarForm] = useState(false)

  const { data: dataCategorias, isLoading } = useQuery({
    queryKey: ['categorias'],
    queryFn: () => getCategorias({
      limit: 1000,
      page: 1
    }),
  })

  const categorias = dataCategorias?.data || []

  const { mutate: create } = useMutation({
    mutationFn: createCategoria,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categorias'] })
      setMostrarForm(false)
      setForm({ nombre: '', descripcion: '' })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    create(form)
  }

  if (isLoading) return <p>Cargando categorías...</p>

  return (
    <div className="text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold mb-1 text-white">Categorías</h1>
          <p className="text-[13px] text-gray-400">Clasificación de productos farmacéuticos</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="px-5 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-[#0f4c35] rounded-lg font-bold transition-colors cursor-pointer"
        >
          + Agregar categoría
        </button>
      </div>

      {mostrarForm && (
        <div className="border border-white/10 rounded-xl p-6 mb-6 max-w-[440px] bg-[#1a1a1a] shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {[
              ['nombre', 'Nombre'],
              ['descripcion', 'Descripción']
            ].map(([name, label]) => (
              <div key={name}>
                <label className="block text-[11px] text-gray-500 mb-1.5 uppercase font-bold tracking-wider">
                  {label}
                </label>
                <input
                  name={name}
                  value={(form as any)[name]}
                  onChange={e => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))}
                  className="w-full px-3.5 py-2.5 bg-[#0f0f0f] border border-white/10 rounded-lg text-sm text-gray-200 outline-none focus:ring-2 focus:ring-[#2ecc71]/20 focus:border-[#2ecc71] transition-all"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="py-3 bg-[#0f4c35] text-white border border-white/10 rounded-lg font-medium hover:bg-[#145a40] transition-colors mt-1"
            >
              Guardar
            </button>
          </form>
        </div>
      )}

      <div className="border border-white/10 rounded-xl overflow-hidden bg-[#121212] shadow-md">
        <table className="w-full border-collapse text-sm">
          <thead>
          <tr className="bg-white/5 border-b border-white/10">
            {['Nombre', 'Descripción', 'Acciones'].map(h => (
              <th key={h} className="px-4 py-3 text-left font-medium text-gray-400 uppercase text-[11px] tracking-wider">
                {h}
              </th>
            ))}
          </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
          {categorias.map((c: any, i: number) => (
            <CategoriaItem
              key={c.id_categoria}
              categoria={c}
              isLast={i === categorias.length - 1}
            />
          ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}