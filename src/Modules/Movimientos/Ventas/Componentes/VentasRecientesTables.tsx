import { useMemo, useState } from "react";
import { ImageOff } from "lucide-react";
import type { SaleRow } from "../ventas.types";

type Props = {
  rows: SaleRow[];
  filter: "TODOS" | "VENTA" | "ENTRADA" | "TRASPASO";
  onChangeFilter: (value: "TODOS" | "VENTA" | "ENTRADA" | "TRASPASO") => void;
  onEdit: (codigoMovimiento: string) => void;
  onAnnul: (codigoMovimiento: string) => void;
  hideFilter?: boolean;
  hidePanelHeader?: boolean;
  title?: string;
  subtitle?: string;
};

export function RecentSalesTable({
  rows,
  filter,
  onChangeFilter,
  onEdit,
  onAnnul,
  hideFilter = false,
  hidePanelHeader = false,
  title = "Movimientos recientes",
  subtitle = "Historial registrado.",
}: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleChangeFilter = (value: "TODOS" | "VENTA" | "ENTRADA" | "TRASPASO") => {
    setCurrentPage(1);
    onChangeFilter(value);
  };

  const totalPages = Math.max(1, Math.ceil(rows.length / itemsPerPage));

  const paginatedRows = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return rows.slice(start, start + itemsPerPage);
  }, [rows, currentPage, itemsPerPage]);

  const getVisiblePages = () => {
    const visible = new Set(
      [1, totalPages, currentPage, currentPage - 1, currentPage + 1].filter(
        (n) => n >= 1 && n <= totalPages
      )
    );
    return [...visible].sort((a, b) => a - b);
  };

  const rangeStart = Math.min((currentPage - 1) * itemsPerPage + 1, rows.length);
  const rangeEnd = Math.min(currentPage * itemsPerPage, rows.length);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {!hidePanelHeader && (
        <div className="p-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>

          {!hideFilter && (
            <select
              value={filter}
              onChange={(e) =>
                handleChangeFilter(e.target.value as "TODOS" | "VENTA" | "ENTRADA" | "TRASPASO")
              }
              className="px-4 py-2 bg-white border border-gray-200 rounded-xl outline-none"
            >
              <option value="TODOS">Todos</option>
              <option value="VENTA">Ventas</option>
              <option value="ENTRADA">Entradas</option>
              <option value="TRASPASO">Traspasos</option>
            </select>
          )}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left min-w-[1060px]">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Código</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ref</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Talla</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cant</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bodega</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Fecha</th>
              <th className="px-4 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center">Acciones</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {paginatedRows.length === 0 ? (
              <tr>
                <td colSpan={11} className="px-6 py-10 text-center text-gray-500">
                  No hay movimientos para mostrar.
                </td>
              </tr>
            ) : (
              paginatedRows.map((s) => (
                <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 font-medium text-gray-900 text-sm">{s.codigo_movimiento}</td>
                  <td className="px-4 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
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
                  <td className="px-4 py-4">
                    {s.ref !== "-" ? (
                      <div className="relative group/refimg inline-block">
                        <div className="w-9 h-9 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center cursor-pointer">
                          {s.imagen_url ? (
                            <img src={s.imagen_url} alt={s.ref} className="w-full h-full object-cover" />
                          ) : (
                            <ImageOff size={13} className="text-gray-300" />
                          )}
                        </div>
                        <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 opacity-0 group-hover/refimg:opacity-100 transition-opacity duration-150">
                          <div className="bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                            <span className="font-bold">{s.ref}</span>
                            {s.desc && <span className="text-gray-300 ml-1">— {s.desc}</span>}
                          </div>
                          <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1" />
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-sm">—</span>
                    )}
                  </td>
                  <td className="px-4 py-4 text-gray-600 text-sm font-medium">{s.talla}</td>
                  <td className="px-4 py-4 text-gray-600 text-sm">{s.qty}</td>
                  <td className="px-4 py-4 text-gray-600 text-sm">${s.price.toLocaleString("es-CO")}</td>
                  <td className="px-4 py-4 font-bold text-gray-900 text-sm">${s.total.toLocaleString("es-CO")}</td>
                  <td className="px-4 py-4 text-gray-600 text-sm">{s.warehouse}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      s.estado === "ANULADO" ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700"
                    }`}>
                      {s.estado}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-500 text-right text-xs">{s.date}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center gap-2">
                      {s.estado !== "ANULADO" && (
                        <>
                          <button
                            onClick={() => onEdit(s.codigo_movimiento)}
                            className="px-3 py-1.5 rounded-lg border border-amber-200 text-amber-700 hover:bg-amber-50 text-xs font-medium"
                          >
                            Corregir
                          </button>
                          <button
                            onClick={() => onAnnul(s.codigo_movimiento)}
                            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 text-xs font-medium"
                          >
                            Anular
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <p className="text-sm text-gray-500">
              {rows.length > 0
                ? `Mostrando ${rangeStart}–${rangeEnd} de ${rows.length} movimiento(s)`
                : "0 movimientos"}
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              Filas por página:
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-1 border border-gray-200 rounded-lg text-sm outline-none"
              >
                {[5, 10, 25, 50].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                ‹
              </button>

              {getVisiblePages().map((n, i, arr) => (
                <>
                  {i > 0 && arr[i - 1] !== n - 1 && (
                    <span key={`dots-${n}`} className="px-1 text-gray-400 text-sm">…</span>
                  )}
                  <button
                    key={n}
                    onClick={() => setCurrentPage(n)}
                    className={`px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                      n === currentPage
                        ? "bg-blue-900 border-blue-900 text-white font-semibold"
                        : "border-gray-200 hover:bg-gray-50 text-gray-700"
                    }`}
                  >
                    {n}
                  </button>
                </>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-2.5 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
