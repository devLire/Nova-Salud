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
        <div style={{ background: '#f8f8f6', borderRadius: 10, padding: '20px 24px' }}>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Total ventas</p>
          <p style={{ fontSize: 24, fontWeight: 600 }}>S/ {totalDia.toFixed(2)}</p>
        </div>
        <div style={{ background: '#f8f8f6', borderRadius: 10, padding: '20px 24px' }}>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Número de transacciones</p>
          <p style={{ fontSize: 24, fontWeight: 600 }}>{ventasDemo.length}</p>
        </div>
        <div style={{ background: '#f8f8f6', borderRadius: 10, padding: '20px 24px' }}>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Ticket promedio</p>
          <p style={{ fontSize: 24, fontWeight: 600 }}>S/ {(totalDia / ventasDemo.length).toFixed(2)}</p>
        </div>
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
              <tr key={v.id} style={{ borderBottom: i < ventasDemo.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                <td style={{ padding: '14px 16px', color: '#888' }}>{v.id}</td>
                <td style={{ padding: '14px 16px' }}>{v.fecha}</td>
                <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f4c35' }}>S/ {v.total.toFixed(2)}</td>
                <td style={{ padding: '14px 16px' }}>{v.metodo_pago}</td>
                <td style={{ padding: '14px 16px' }}>{v.cajero}</td>
                <td style={{ padding: '14px 16px', color: '#888' }}>{v.items} items</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}