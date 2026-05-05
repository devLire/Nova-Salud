import MetricaCard from './components/MetricaCard'
import AlertaRow from './components/AlertaRow'

// Datos de ejemplo — reemplaza con llamadas reales a tu API
const alertas = [
  { id: 1, nombre: 'Paracetamol 500mg', stock_actual: 3, stock_minimo: 10, proveedor: 'Farma Perú SAC' },
  { id: 2, nombre: 'Amoxicilina 250mg', stock_actual: 1, stock_minimo: 15, proveedor: 'MedDistrib EIRL' },
  { id: 3, nombre: 'Ibuprofeno 400mg', stock_actual: 5, stock_minimo: 20, proveedor: 'Farma Perú SAC' },
]

const metricas = [
  { label: 'Ventas hoy', valor: 'S/ 1,240.00' },
  { label: 'Productos en alerta', valor: '3' },
  { label: 'Ingresos registrados', valor: '2' },
  { label: 'Total productos', valor: '142' },
]

export default function Dashboard() {
  return (
    <div>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Dashboard</h1>
      <p style={{ color: '#666', marginBottom: 32 }}>Resumen del día y alertas de reposición</p>

      {/* Métricas rápidas */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {metricas.map(m => (
          <MetricaCard key={m.label} label={m.label} valor={m.valor} />
        ))}
      </div>

      {/* Módulo de alertas */}
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ background: '#fef2f2', color: '#dc2626', borderRadius: 6, padding: '2px 10px', fontSize: 13 }}>⚠ Alertas de stock bajo</span>
      </h2>

      {alertas.length === 0 ? (
        <p style={{ color: '#888' }}>No hay productos con stock bajo.</p>
      ) : (
        <div style={{ border: '1px solid #e5e7eb', borderRadius: 10, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#555' }}>Producto</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 500, color: '#555' }}>Stock actual</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 500, color: '#555' }}>Stock mínimo</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 500, color: '#555' }}>Proveedor</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 500, color: '#555' }}>Estado</th>
              </tr>
            </thead>
            <tbody>
              {alertas.map((a, i) => (
                <AlertaRow key={a.id} alerta={a} isLast={i === alertas.length - 1} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}