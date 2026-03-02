import type { UserItem } from "../users.types";

type Props = {
  users: UserItem[];
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
};

export function UsersTable({ users, onEdit, onDelete }: Props) {
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
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-4 font-mono text-sm text-gray-500">{u.id}</td>

              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
                    {u.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <span className="font-semibold text-gray-900">{u.name}</span>
                </div>
              </td>

              <td className="px-6 py-4 text-gray-600">{u.role}</td>

              <td className="px-6 py-4">
                <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
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
                  onClick={() => onDelete(u)}
                  className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}