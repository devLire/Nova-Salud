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
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 4 }}>Reportes de ventas</h1>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 32 }}>Historial de transacciones registradas</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 32 }}>
        <ReportMetricaCard label="Total ventas" valor={`S/ ${totalDia.toFixed(2)}`} />
        <ReportMetricaCard label="Número de transacciones" valor={ventasDemo.length} />
        <ReportMetricaCard label="Ticket promedio" valor={`S/ ${(totalDia / ventasDemo.length).toFixed(2)}`} />
      </div>

      <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              {['#', 'Fecha y hora', 'Total', 'Método de pago', 'Cajero', 'Productos'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#555' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ventasDemo.map((v, i) => (
              <VentaRow key={v.id} venta={v} isLast={i === ventasDemo.length - 1} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}