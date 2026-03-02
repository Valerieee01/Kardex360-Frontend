import type { ModulePermission, RoleItem } from "../roles.types";
import { PermissionRow } from "./PermissionRow";

type Props = {
  roles: RoleItem[];
  roleId: string;
  onRoleChange: (roleId: string) => void;

  permissions: ModulePermission[];
  onToggle: (moduleKey: string, enabled: boolean) => void;

  onSave: () => void;
};

export function RolePermissionsCard({
  roles,
  roleId,
  onRoleChange,
  permissions,
  onToggle,
  onSave,
}: Props) {
  const currentRole = roles.find((r) => r.id === roleId);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Asignación de Permisos</h3>

        <select
          value={roleId}
          onChange={(e) => onRoleChange(e.target.value)}
          className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none font-semibold text-sm"
        >
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              Seleccionar Rol: {r.name}
            </option>
          ))}
        </select>
      </div>

      <div className="p-6 space-y-4">
        {permissions.map((mod) => (
          <PermissionRow
            key={mod.key}
            mod={mod}
            onToggle={(enabled) => onToggle(mod.key, enabled)}
          />
        ))}

        {permissions.length === 0 && (
          <div className="p-4 bg-gray-50 rounded-xl text-sm text-gray-600">
            No hay permisos cargados para {currentRole?.name ?? "este rol"}.
          </div>
        )}
      </div>

      <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
        <button
          onClick={onSave}
          className="px-6 py-2.5 bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/10"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  );
}