import { useMemo, useState } from "react";
import type { UserItem } from "../users.types";

type Props = {
  users: UserItem[];
  onEdit: (user: UserItem) => void;
  onToggleStatus: (user: UserItem) => void;
};

export function UsersTable({ users, onEdit, onToggleStatus }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.max(1, Math.ceil(users.length / itemsPerPage));

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return users.slice(start, start + itemsPerPage);
  }, [users, currentPage, itemsPerPage]);

  const getVisiblePages = () => {
    const visible = new Set(
      [1, totalPages, currentPage, currentPage - 1, currentPage + 1].filter(
        (n) => n >= 1 && n <= totalPages
      )
    );
    return [...visible].sort((a, b) => a - b);
  };

  const rangeStart = Math.min((currentPage - 1) * itemsPerPage + 1, users.length);
  const rangeEnd = Math.min(currentPage * itemsPerPage, users.length);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-100">
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre Completo</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
            <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {paginatedUsers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                No hay usuarios para mostrar.
              </td>
            </tr>
          ) : (
            paginatedUsers.map((u) => (
              <tr key={u.identificacion} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-mono text-sm text-gray-500">{u.identificacion}</td>

                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
                      {u.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <span className="font-semibold text-gray-900">{u.name}</span>
                  </div>
                </td>

                <td className="px-6 py-4 text-gray-600">{u.role}</td>

                <td className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-bold rounded-full ${
                      u.status === "Activo"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {u.status}
                  </span>
                </td>

                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => onEdit(u)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => onToggleStatus(u)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      u.status === "Activo"
                        ? "text-red-600 hover:bg-red-50"
                        : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {u.status === "Activo" ? "Inactivar" : "Activar"}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Pie: info + filas por página + paginador */}
      <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <p className="text-sm text-gray-500">
            {users.length > 0
              ? `Mostrando ${rangeStart}–${rangeEnd} de ${users.length} usuario(s)`
              : "0 usuarios"}
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            Filas por página:
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-900/10"
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
                  <span key={`dots-${n}`} className="px-1 text-gray-400 text-sm">
                    …
                  </span>
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
  );
}