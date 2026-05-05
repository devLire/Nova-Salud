export interface ReportMetricaCardProps {
  label: string;
  valor: string | number;
}

export default function ReportMetricaCard({ label, valor }: ReportMetricaCardProps) {
  return (
    <div style={{ background: '#f8f8f6', borderRadius: 10, padding: '20px 24px' }}>
      <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>{label}</p>
      <p style={{ fontSize: 24, fontWeight: 600 }}>{valor}</p>
    </div>
  );
}
