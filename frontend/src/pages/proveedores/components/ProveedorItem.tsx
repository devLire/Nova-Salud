export interface ProveedorProps {
  proveedor: {
    id_proveedor: number;
    nombre_empresa: string;
    contacto: string;
    telefono: string;
  };
  isLast: boolean;
  onDelete?: (id: number) => void;
}

export default function ProveedorItem({ proveedor, isLast, onDelete }: ProveedorProps) {
  return (
    <tr style={{ borderBottom: isLast ? 'none' : '1px solid #f3f4f6' }}>
      <td style={{ padding: '14px 16px', fontWeight: 500 }}>{proveedor.nombre_empresa}</td>
      <td style={{ padding: '14px 16px' }}>{proveedor.contacto}</td>
      <td style={{ padding: '14px 16px', color: '#888' }}>{proveedor.telefono}</td>
      <td style={{ padding: '14px 16px' }}>
        <button style={{ marginRight: 8, padding: '6px 12px', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', background: 'white', fontSize: 12 }}>Editar</button>
        <button onClick={() => onDelete && onDelete(proveedor.id_proveedor)} style={{ padding: '6px 12px', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer', background: '#fef2f2', color: '#dc2626', fontSize: 12 }}>Eliminar</button>
      </td>
    </tr>
  );
}
