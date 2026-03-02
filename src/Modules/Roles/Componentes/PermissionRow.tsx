import type { ModulePermission } from "../roles.types";

type Props = {
  mod: ModulePermission;
  onToggle: (enabled: boolean) => void;
};

export function PermissionRow({ mod, onToggle }: Props) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
      <div>
        <p className="font-bold text-gray-900">{mod.label}</p>
        <p className="text-sm text-gray-500">{mod.enabled ? mod.description : "Sin Acceso"}</p>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={mod.enabled}
          onChange={(e) => onToggle(e.target.checked)}
          className="w-5 h-5 rounded border-gray-300 text-blue-900 focus:ring-blue-900"
        />
        <span className="text-sm font-medium">Habilitado</span>
      </label>
    </div>
  );
}