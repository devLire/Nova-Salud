import VentaRow from './components/VentaRow'
import ReportMetricaCard from './components/ReportMetricaCard'

const ventasDemo = [
  { id: 1, fecha: '2025-04-28 10:32', total: 12.50, metodo_pago: 'Efectivo', cajero: 'Ana López', items: 3 },
  { id: 2, fecha: '2025-04-28 11:15', total: 5.80, metodo_pago: 'Yape / Plin', cajero: 'Ana López', items: 2 },
  { id: 3, fecha: '2025-04-27 14:20', total: 34.00, metodo_pago: 'Tarjeta', cajero: 'Carlos Ramos', items: 7 },
]

export default function Reportes() {
  const totalDia = ventasDemo.reduce((s, v) => s + v.total, 0)

  return (
    <div className="text-gray-100">
      <h1 className="text-[22px] font-semibold mb-1 text-white">Reportes de ventas</h1>
      <p className="text-[13px] text-gray-400 mb-8">Historial de transacciones registradas</p>

      {/* Métricas con alineación de barra corregida */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <ReportMetricaCard label="Total ventas" valor={`S/ ${totalDia.toFixed(2)}`} />
        <ReportMetricaCard label="Número de transacciones" valor={ventasDemo.length} />
        <ReportMetricaCard label="Ticket promedio" valor={`S/ ${(totalDia / (ventasDemo.length || 1)).toFixed(2)}`} />
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
            {ventasDemo.map((v, i) => (
              <VentaRow
                key={v.id}
                venta={v}
                isLast={i === ventasDemo.length - 1}
              />
            ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}