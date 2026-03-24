import type { SizeItem } from "../sizes.types";

type Props = {
  rows: SizeItem[];
  onEdit: (item: SizeItem) => void;
  onDelete: (item: SizeItem) => void;
};

export function SizesTable({ rows, onEdit, onDelete }: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
              Talla
            </th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
              Acciones
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item, index) => (
            <tr
              key={item.id ?? `${item.talla}-${index}`}
              className="hover:bg-gray-50/50 transition-colors"
            >
              <td className="px-6 py-4 font-medium text-gray-900">{item.talla}</td>
              <td className="px-6 py-4 text-right space-x-2">
                <button
                  onClick={() => onEdit(item)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Editar
                </button>
                <button
                  onClick={() => onDelete(item)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}

          {rows.length === 0 && (
            <tr>
              <td colSpan={2} className="px-6 py-10 text-center text-sm text-gray-500">
                No hay tallas para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}