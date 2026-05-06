import { useQuery } from '@tanstack/react-query'
import VentaRow from './components/VentaRow'
import ReportMetricaCard from './components/ReportMetricaCard'
import { getVentas } from '@/actions/ventas.action.ts'

export default function Reportes() {
  const { data: dataVentas, isLoading } = useQuery({
    queryKey: ['ventas'],
    queryFn: () => getVentas({
      limit: 1000,
      page: 1
    })
  })

  const ventas = dataVentas?.data || []

  const totalDia = ventas.reduce((s: number, v: any) => s + Number(v.total), 0)

  if (isLoading) return <p className="text-gray-100">Cargando reportes...</p>

  return (
    <div className="text-gray-100">
      <h1 className="text-[22px] font-semibold mb-1 text-white">Reportes de ventas</h1>
      <p className="text-[13px] text-gray-400 mb-8">Historial de transacciones registradas</p>

      {/* Métricas con alineación de barra corregida */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <ReportMetricaCard label="Total ventas" valor={`S/ ${totalDia.toFixed(2)}`} />
        <ReportMetricaCard label="Número de transacciones" valor={ventas.length.toString()} />
        <ReportMetricaCard label="Ticket promedio" valor={`S/ ${(totalDia / (ventas.length || 1)).toFixed(2)}`} />
      </div>

      <div className="w-full overflow-hidden border border-white/10 rounded-xl bg-[#121212] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm min-w-[900px]">
            <thead>
            <tr className="bg-white/5 border-b border-white/10">
              {['#', 'Fecha y hora', 'Total', 'Método de pago', 'Cajero', 'Productos'].map(h => (
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
            {ventas.map((v: any, i: number) => (
              <VentaRow
                key={v.id_venta}
                venta={v}
                isLast={i === ventas.length - 1}
              />
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}