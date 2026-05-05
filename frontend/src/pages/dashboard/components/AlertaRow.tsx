export interface AlertaProps {
  alerta: {
    id: number;
    nombre: string;
    stock_actual: number;
    stock_minimo: number;
    proveedor: string;
  };
  isLast: boolean;
}

export default function AlertaRow({ alerta, isLast }: AlertaProps) {
  return (
    <tr style={{ borderBottom: isLast ? 'none' : '1px solid #f3f4f6' }}>
      <td style={{ padding: '14px 16px', fontWeight: 500 }}>{alerta.nombre}</td>
      <td style={{ padding: '14px 16px', textAlign: 'center', color: '#dc2626', fontWeight: 700 }}>{alerta.stock_actual}</td>
      <td style={{ padding: '14px 16px', textAlign: 'center', color: '#888' }}>{alerta.stock_minimo}</td>
      <td style={{ padding: '14px 16px', color: '#555' }}>{alerta.proveedor}</td>
      <td style={{ padding: '14px 16px', textAlign: 'center' }}>
        <span style={{ background: '#fef2f2', color: '#dc2626', borderRadius: 20, padding: '4px 12px', fontSize: 12 }}>Reponer</span>
      </td>
    </tr>
  );
}
