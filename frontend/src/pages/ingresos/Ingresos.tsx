import {useState} from 'react'
import {useQuery, useMutation, useQueryClient} from '@tanstack/react-query'
import IngresoItem from './components/IngresoItem'
import {getIngresos, createIngreso} from '@/actions/ingresos.action.ts'
import {getProductos} from '@/actions/productos.action.ts'
import {getProveedores} from '@/actions/proveedores.action.ts'
import type {Datum} from '@/infrastructure/interfaces/responses/ingresos.response'

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
  const {data: historial = [] as Datum[]} = useQuery({queryKey: ['ingresos'], queryFn: getIngresos})
  const {data: productos = []} = useQuery({queryKey: ['productos'], queryFn: getProductos})
  const {data: proveedores = []} = useQuery({queryKey: ['proveedores'], queryFn: getProveedores})

  const {mutate: addIngreso} = useMutation({
    mutationFn: createIngreso,
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ['ingresos']})
      queryClient.invalidateQueries({queryKey: ['productos']})
      setForm({
        id_producto: '',
        cantidad_ingresada: '',
        id_proveedor: '',
        fecha_ingreso: new Date().toISOString().split('T')[0]
      })
    }
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(prev => ({...prev, [e.target.name]: e.target.value}))
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
    <div className="text-gray-100">
      <h1 className="text-[22px] font-semibold mb-1 text-white">Ingresos de Inventario</h1>
      <p className="text-[13px] text-gray-400 mb-8">Registra la llegada de mercadería del proveedor</p>

      {/* Formulario */}
      <div className="border border-white/10 rounded-xl p-6 mb-10 max-w-[560px] mx-auto bg-[#1a1a1a] shadow-xl">
        <h2 className="text-base font-semibold mb-5 text-white">Nuevo ingreso</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              className="block text-[11px] text-gray-500 mb-1.5 uppercase font-bold tracking-wider">Producto</label>
            <select
              name="id_producto"
              value={form.id_producto}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#0f0f0f] border border-white/10 rounded-lg text-sm text-gray-200 outline-none focus:ring-2 focus:ring-[#2ecc71]/20 focus:border-[#2ecc71] transition-all appearance-none"
            >
              <option value="" className="bg-[#1a1a1a]">Selecciona un producto</option>
              {Array.isArray(productos) && productos.map((p: any) => (
                <option key={p.id_producto || p.id} value={p.id_producto || p.id} className="bg-[#1a1a1a]">
                  {p.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 mb-1.5 uppercase font-bold tracking-wider">Cantidad
              ingresada</label>
            <input
              name="cantidad_ingresada"
              type="number"
              min="1"
              value={form.cantidad_ingresada}
              onChange={handleChange}
              placeholder="Ej: 100"
              className="w-full px-3.5 py-2.5 bg-[#0f0f0f] border border-white/10 rounded-lg text-sm text-gray-200 outline-none focus:ring-2 focus:ring-[#2ecc71]/20 focus:border-[#2ecc71] transition-all"
            />
          </div>

          <div>
            <label
              className="block text-[11px] text-gray-500 mb-1.5 uppercase font-bold tracking-wider">Proveedor</label>
            <select
              name="id_proveedor"
              value={form.id_proveedor}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#0f0f0f] border border-white/10 rounded-lg text-sm text-gray-200 outline-none focus:ring-2 focus:ring-[#2ecc71]/20 focus:border-[#2ecc71] transition-all appearance-none"
            >
              <option value="" className="bg-[#1a1a1a]">Selecciona un proveedor</option>
              {Array.isArray(proveedores) && proveedores.map((p: any) => (
                <option key={p.id_proveedor || p.id} value={p.id_proveedor || p.id} className="bg-[#1a1a1a]">
                  {p.nombre_empresa}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] text-gray-500 mb-1.5 uppercase font-bold tracking-wider">Fecha</label>
            <input
              name="fecha_ingreso"
              type="date"
              value={form.fecha_ingreso}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-[#0f0f0f] border border-white/10 rounded-lg text-sm text-gray-200 outline-none focus:ring-2 focus:ring-[#2ecc71]/20 focus:border-[#2ecc71] transition-all [color-scheme:dark]"
            />
          </div>

          <button
            type="submit"
            className="mt-2 py-3 bg-[#0f4c35] text-white border border-white/10 rounded-lg font-bold hover:bg-[#145a40] active:scale-[0.98] transition-all shadow-lg"
          >
            Registrar ingreso
          </button>
        </form>
      </div>

      {/* Historial */}
      <h2 className="text-base font-semibold mb-4 text-white">Historial de ingresos</h2>
      <div className="border border-white/10 rounded-xl overflow-hidden bg-[#121212] shadow-md">
        <table className="w-full border-collapse text-sm">
          <thead>
          <tr className="bg-white/5 border-b border-white/10">
            {['Producto', 'Cantidad', 'Proveedor', 'Fecha', 'Registrado por'].map((h) => (
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
          {historial?.map((h: any, i: number) => (
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
  );
}