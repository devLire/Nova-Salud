export interface VentaProps {
  venta: {
    id: number;
    fecha: string;
    total: number;
    metodo_pago: string;
    cajero: string;
    items: number;
  };
  isLast: boolean;
}

export default function VentaRow({ venta, isLast }: VentaProps) {
  return (
    <tr style={{ borderBottom: isLast ? 'none' : '1px solid #f3f4f6' }}>
      <td style={{ padding: '14px 16px', color: '#888' }}>{venta.id}</td>
      <td style={{ padding: '14px 16px' }}>{venta.fecha}</td>
      <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f4c35' }}>S/ {venta.total.toFixed(2)}</td>
      <td style={{ padding: '14px 16px' }}>{venta.metodo_pago}</td>
      <td style={{ padding: '14px 16px' }}>{venta.cajero}</td>
      <td style={{ padding: '14px 16px', color: '#888' }}>{venta.items} items</td>
    </tr>
  );
}
