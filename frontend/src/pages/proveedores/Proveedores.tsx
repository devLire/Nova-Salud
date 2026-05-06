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
    <div className="text-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-semibold mb-1 text-white">Proveedores</h1>
          <p className="text-[13px] text-gray-400">Gestión de proveedores de la botica</p>
        </div>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="px-5 py-2.5 bg-[#2ecc71] hover:bg-[#27ae60] text-[#0f4c35] rounded-lg font-bold transition-colors cursor-pointer"
        >
          + Agregar proveedor
        </button>
      </div>

      {mostrarForm && (
        <div className="border border-white/10 rounded-xl p-6 mb-6 max-w-[480px] bg-[#1a1a1a] shadow-xl">
          <h2 className="text-base font-semibold mb-4 text-white">Nuevo proveedor</h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
            {[
              ['nombre_empresa', 'Nombre de empresa'],
              ['contacto', 'Persona de contacto'],
              ['telefono', 'Teléfono']
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
              className="py-3 bg-[#0f4c35] text-white border border-white/10 rounded-lg font-bold hover:bg-[#145a40] transition-colors mt-1"
            >
              Guardar
            </button>
          </form>
        </div>
      )}

      <div className="w-full overflow-hidden border border-white/10 rounded-xl bg-[#121212] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
            <tr className="bg-white/5 border-b border-white/10">
              {['Empresa', 'Contacto', 'Teléfono', 'Acciones'].map(h => (
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
    </div>
  );
}