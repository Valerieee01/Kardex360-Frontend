import type { SaleRow } from "../ventas.types";

type Props = {
  rows: SaleRow[];
  onViewFullReport: () => void;
};

export function RecentSalesTable({ rows, onViewFullReport }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ref</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cant</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Fecha</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {rows.map((s) => (
            <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">{s.ref}</td>
              <td className="px-6 py-4 text-gray-600">{s.qty}</td>
              <td className="px-6 py-4 font-bold text-gray-900">
                ${s.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 text-gray-500 text-right text-sm">{s.date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4 bg-gray-50/50 text-center">
        <button onClick={onViewFullReport} className="text-sm font-semibold text-blue-900 hover:underline">
          Ver reporte completo de ventas
        </button>
      </div>
    </div>
  );
}