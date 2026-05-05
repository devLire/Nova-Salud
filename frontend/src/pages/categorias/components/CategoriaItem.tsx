export interface CategoriaProps {
  categoria: {
    id_categoria: number;
    nombre: string;
    descripcion: string;
  };
  isLast: boolean;
  onDelete?: (id: number) => void;
}

export default function CategoriaItem({ categoria, isLast, onDelete }: CategoriaProps) {
  return (
    <tr style={{ borderBottom: isLast ? 'none' : '1px solid #f3f4f6' }}>
      <td style={{ padding: '14px 16px', fontWeight: 500 }}>{categoria.nombre}</td>
      <td style={{ padding: '14px 16px', color: '#888' }}>{categoria.descripcion}</td>
      <td style={{ padding: '14px 16px' }}>
        <button style={{ marginRight: 8, padding: '6px 12px', border: '1px solid #ddd', borderRadius: 6, cursor: 'pointer', background: 'white', fontSize: 12 }}>Editar</button>
        <button onClick={() => onDelete && onDelete(categoria.id_categoria)} style={{ padding: '6px 12px', border: '1px solid #fecaca', borderRadius: 6, cursor: 'pointer', background: '#fef2f2', color: '#dc2626', fontSize: 12 }}>Eliminar</button>
      </td>
    </tr>
  );
}
