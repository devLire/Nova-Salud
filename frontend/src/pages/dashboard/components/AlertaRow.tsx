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
    <tr className={`${isLast ? 'border-none' : 'border-b border-white/5'} hover:bg-white/[0.02] transition-colors`}>
      <td className="p-4 font-medium text-gray-200">
        {alerta.nombre}
      </td>
      <td className="p-4 text-center text-red-500 font-bold">
        {alerta.stock_actual}
      </td>
      <td className="p-4 text-center text-gray-500">
        {alerta.stock_minimo}
      </td>
      <td className="p-4 text-gray-400">
        {alerta.proveedor}
      </td>
      <td className="p-4 text-center">
      <span className="bg-red-500/10 text-red-500 border border-red-500/20 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
        Reponer
      </span>
      </td>
    </tr>
  );
}
