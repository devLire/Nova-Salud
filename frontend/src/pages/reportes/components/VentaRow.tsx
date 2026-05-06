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
    <tr className={`${isLast ? 'border-none' : 'border-b border-white/5'} hover:bg-white/[0.02] transition-colors`}>
      {/* ID de Venta */}
      <td className="p-4 text-center text-gray-500 font-mono text-xs">
        #{venta.id}
      </td>

      {/* Fecha y Hora */}
      <td className="p-4 text-center text-gray-300">
        {venta.fecha}
      </td>

      {/* Total */}
      <td className="p-4 text-center font-bold text-[#2ecc71]">
        S/ {venta.total.toFixed(2)}
      </td>

      {/* Método de Pago */}
      <td className="p-4 text-center text-gray-300">
      <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-[11px] uppercase tracking-wider">
        {venta.metodo_pago}
      </span>
      </td>

      {/* Cajero */}
      <td className="p-4 text-center text-gray-300">
        {venta.cajero}
      </td>

      {/* Cantidad de Productos */}
      <td className="p-4 text-center text-gray-500">
        {venta.items} items
      </td>
    </tr>
  );
}
