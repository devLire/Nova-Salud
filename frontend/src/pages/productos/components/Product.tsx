export interface ProductoProps {
  producto: {
    id_producto: number;
    nombre: string;
    codigo_barras: string;
    precio_venta: string | number;
    stock_actual: number;
    stock_minimo: number;
    categoria: { nombre: string } | string | any;
  };
  isLast: boolean;
}

export default function Product({ producto, isLast }: ProductoProps) {
  const precio = Number(producto.precio_venta).toFixed(2);
  const categoriaNombre = typeof producto.categoria === 'string' ? producto.categoria : (producto.categoria?.nombre || '');

  return (
    <tr style={{ borderBottom: isLast ? 'none' : '1px solid #f3f4f6' }}>
      <td style={{ padding: '14px 16px', fontWeight: 500 }}>{producto.nombre}</td>
      <td style={{ padding: '14px 16px', color: '#888' }}>{producto.codigo_barras}</td>
      <td style={{ padding: '14px 16px' }}>S/ {precio}</td>
      <td style={{ padding: '14px 16px', color: producto.stock_actual < producto.stock_minimo ? '#dc2626' : '#16a34a', fontWeight: 600 }}>{producto.stock_actual}</td>
      <td style={{ padding: '14px 16px', color: '#888' }}>{producto.stock_minimo}</td>
      <td style={{ padding: '14px 16px' }}>{categoriaNombre}</td>
      <td style={{ padding: '14px 16px' }}>
        {producto.stock_actual < producto.stock_minimo
          ? <span style={{ background: '#fef2f2', color: '#dc2626', borderRadius: 20, padding: '4px 10px', fontSize: 12 }}>⚠ Stock bajo</span>
          : <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: 20, padding: '4px 10px', fontSize: 12 }}>✓ OK</span>
        }
      </td>
      <td style={{ padding: '14px 16px' }}>
        <button style={{ marginRight: 8, padding: '6px 12px', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', background: 'white', fontSize: 12 }}>Editar</button>
      </td>
    </tr>
  );
}
