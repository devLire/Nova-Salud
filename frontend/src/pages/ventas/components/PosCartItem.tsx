import type { Producto } from './PosProductItem';

export interface ItemCarrito extends Producto {
  cantidad: number;
}

export interface PosCartItemProps {
  item: ItemCarrito;
  onCambiarCantidad: (id: number, delta: number) => void;
  onEliminar: (id: number) => void;
}

export default function PosCartItem({ item, onCambiarCantidad, onEliminar }: PosCartItemProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 14 }}>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 500 }}>{item.nombre}</p>
        <p style={{ color: '#888', fontSize: 12 }}>S/ {item.precio_venta.toFixed(2)} c/u</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <button onClick={() => onCambiarCantidad(item.id, -1)} style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', background: 'white' }}>-</button>
        <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{item.cantidad}</span>
        <button onClick={() => onCambiarCantidad(item.id, 1)} style={{ width: 26, height: 26, border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', background: 'white' }}>+</button>
        <span style={{ minWidth: 60, textAlign: 'right', fontWeight: 600 }}>S/ {(item.precio_venta * item.cantidad).toFixed(2)}</span>
        <button onClick={() => onEliminar(item.id)} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>✕</button>
      </div>
    </div>
  );
}
