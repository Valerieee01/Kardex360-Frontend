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
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Código</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Categoría</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 font-medium text-gray-900">{item.code}</td>
              <td className="px-6 py-4 text-gray-600">{item.name}</td>
              <td className="px-6 py-4 text-gray-600">{item.category}</td>
              <td className="px-6 py-4 text-gray-600">{item.description}</td>
              <td className="px-6 py-4">
                <span
                  className={
                    "px-2 py-1 rounded-full text-xs font-bold uppercase tracking-wider " +
                    (item.status === "Activo"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-amber-100 text-amber-700")
                  }
                >
                  {item.status}
                </span>
              </td>
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
              <td colSpan={6} className="px-6 py-10 text-center text-sm text-gray-500">
                No hay tallas para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}