export interface Producto {
  id: number;
  nombre: string;
  precio_venta: number;
  codigo_barras: string;
}

export interface PosProductItemProps {
  producto: Producto;
  onAgregar: (producto: Producto) => void;
}

export default function PosProductItem({ producto, onAgregar }: PosProductItemProps) {
  return (
    <div
      onClick={() => onAgregar(producto)}
      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', border: '1px solid #e5e7eb', borderRadius: 10, cursor: 'pointer', transition: 'background 0.15s' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#f0fdf4')}
      onMouseLeave={e => (e.currentTarget.style.background = 'white')}
    >
      <div>
        <p style={{ fontWeight: 500, marginBottom: 2 }}>{producto.nombre}</p>
        <p style={{ fontSize: 12, color: '#888' }}>Código: {producto.codigo_barras}</p>
      </div>
      <span style={{ fontWeight: 600, color: '#0f4c35', fontSize: 16 }}>S/ {producto.precio_venta.toFixed(2)}</span>
    </div>
  );
}
