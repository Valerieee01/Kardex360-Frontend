import type { SaleRow } from "../ventas.types";

type Props = {
  rows: SaleRow[];
  filter: "TODOS" | "VENTA" | "ENTRADA" | "TRASPASO";
  onChangeFilter: (value: "TODOS" | "VENTA" | "ENTRADA" | "TRASPASO") => void;
  onEdit: (codigoMovimiento: string) => void;
  onAnnul: (codigoMovimiento: string) => void;
};

export function RecentSalesTable({
  rows,
  filter,
  onChangeFilter,
  onEdit,
  onAnnul,
}: Props) {
  console.log("ROWS EN TABLA:", rows);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between gap-4">
        <div>
          <h3 className="font-bold text-gray-900">Movimientos recientes</h3>
          <p className="text-sm text-gray-500">Ventas, entradas y traspasos registrados.</p>
        </div>

        <select
          value={filter}
          onChange={(e) =>
            onChangeFilter(e.target.value as "TODOS" | "VENTA" | "ENTRADA" | "TRASPASO")
          }
          className="px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none"
        >
          <option value="TODOS">Todos</option>
          <option value="VENTA">Ventas</option>
          <option value="ENTRADA">Entradas</option>
          <option value="TRASPASO">Traspasos</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[980px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ref</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cant</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bodega</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Fecha</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={10} className="px-6 py-10 text-center text-gray-500">
                  No hay movimientos para mostrar.
                </td>
              </tr>
            ) : (
              rows.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{s.codigo_movimiento}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        s.tipo === "VENTA" 
                          ? "bg-red-100 text-red-700"
                          : s.tipo === "ENTRADA"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {s.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{s.ref}</td>
                  <td className="px-6 py-4 text-gray-600">{s.qty}</td>
                  <td className="px-6 py-4 text-gray-600">${s.price.toLocaleString("es-CO")}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">${s.total.toLocaleString("es-CO")}</td>
                  <td className="px-6 py-4 text-gray-600">{s.warehouse}</td>
                  <td className="px-6 py-4 text-gray-600">{s.estado}</td>
                  <td className="px-6 py-4 text-gray-500 text-right text-sm">{s.date}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(s.codigo_movimiento)}
                        className="px-3 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 text-sm"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => onAnnul(s.codigo_movimiento)}
                        className="px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-sm"
                      >
                        Anular
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}