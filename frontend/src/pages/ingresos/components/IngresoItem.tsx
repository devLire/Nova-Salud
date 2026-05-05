import type { Datum } from '@/infrastructure/interfaces/responses/ingresos.response.ts';

export interface IngresoProps {
  ingreso: Datum;
  isLast: boolean;
}

export default function IngresoItem({ ingreso, isLast }: IngresoProps) {
  const fechaFormateada = new Date(ingreso.fecha_ingreso).toLocaleDateString();

  return (
    <tr style={{ borderBottom: isLast ? 'none' : '1px solid #f3f4f6' }}>
      <td style={{ padding: '14px 16px', fontWeight: 500 }}>
        {ingreso.producto?.nombre || 'Desconocido'}
      </td>

      <td style={{ padding: '14px 16px', color: '#16a34a', fontWeight: 600 }}>
        +{ingreso.cantidad_ingresada}
      </td>

      <td style={{ padding: '14px 16px' }}>
        {ingreso.producto?.proveedor?.nombre_empresa || 'Sin proveedor'}
      </td>

      <td style={{ padding: '14px 16px', color: '#888' }}>
        {fechaFormateada}
      </td>

      <td style={{ padding: '14px 16px', color: '#888' }}>
        {ingreso.usuario?.nombre || 'Desconocido'}
      </td>
    </tr>
  );
}