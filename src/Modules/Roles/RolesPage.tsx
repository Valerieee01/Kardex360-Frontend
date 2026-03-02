import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { ModulePermission, RoleItem } from "./roles.types";
import { RolePermissionsCard } from "./Componentes/RolePermisonsCard";

const ROLES: RoleItem[] = [
  { id: "ROL-SELLER", name: "Vendedor" },
  { id: "ROL-ADMIN", name: "Administrador" },
  { id: "ROL-SUP", name: "Supervisor" },
];

const DEFAULT_PERMS: Record<string, ModulePermission[]> = {
  "ROL-SELLER": [
    { key: "inventory", label: "Inventario", description: "Ver, Editar, Crear", enabled: true },
    { key: "sales", label: "Ventas", description: "Registrar Ventas", enabled: true },
    { key: "transfers", label: "Traspasos", description: "Ver y Crear", enabled: true },
    { key: "reports", label: "Reportes", description: "Sin Acceso", enabled: false },
    { key: "settings", label: "Configuración", description: "Sin Acceso", enabled: false },
  ],
  "ROL-ADMIN": [
    { key: "inventory", label: "Inventario", description: "Acceso total", enabled: true },
    { key: "sales", label: "Ventas", description: "Acceso total", enabled: true },
    { key: "transfers", label: "Traspasos", description: "Acceso total", enabled: true },
    { key: "reports", label: "Reportes", description: "Acceso total", enabled: true },
    { key: "settings", label: "Configuración", description: "Acceso total", enabled: true },
  ],
  "ROL-SUP": [
    { key: "inventory", label: "Inventario", description: "Ver", enabled: true },
    { key: "sales", label: "Ventas", description: "Ver", enabled: true },
    { key: "transfers", label: "Traspasos", description: "Ver", enabled: true },
    { key: "reports", label: "Reportes", description: "Ver", enabled: true },
    { key: "settings", label: "Configuración", description: "Sin Acceso", enabled: false },
  ],
};

export function RolesPage() {
  const [roleId, setRoleId] = useState<string>(ROLES[0].id);

  // clonamos para poder editar sin mutar el "DEFAULT_PERMS"
  const [permsByRole, setPermsByRole] = useState<Record<string, ModulePermission[]>>(() => {
    const clone: Record<string, ModulePermission[]> = {};
    for (const key of Object.keys(DEFAULT_PERMS)) {
      clone[key] = DEFAULT_PERMS[key].map((p) => ({ ...p }));
    }
    return clone;
  });

  const perms = useMemo(() => permsByRole[roleId] ?? [], [permsByRole, roleId]);

  const handleToggle = (moduleKey: string, enabled: boolean) => {
    setPermsByRole((prev) => ({
      ...prev,
      [roleId]: (prev[roleId] ?? []).map((p) =>
        p.key === moduleKey
          ? {
              ...p,
              enabled,
              // opcional: ajustar descripción si cambias enabled
              description: enabled ? p.description === "Sin Acceso" ? "Acceso habilitado" : p.description : "Sin Acceso",
            }
          : p
      ),
    }));
  };

  const handleSave = () => {
    // ✅ aquí luego conectas backend (PUT/POST permisos por rol)
    toast.success("Permisos guardados");
    console.log("Guardar permisos rol:", roleId, permsByRole[roleId]);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Roles y Permisos</h2>
        <p className="text-gray-500">Defina qué módulos puede ver cada tipo de usuario.</p>
      </div>

      <RolePermissionsCard
        roles={ROLES}
        roleId={roleId}
        onRoleChange={setRoleId}
        permissions={perms}
        onToggle={handleToggle}
        onSave={handleSave}
      />
    </div>
  );
}