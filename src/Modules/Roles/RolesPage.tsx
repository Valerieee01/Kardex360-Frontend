import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ModulePermission, RoleItem } from "./roles.types";
import { RolePermissionsCard } from "./Componentes/RolePermisonsCard";
import { getPermissionsByRole, updatePermissionsByRole } from "../../services/roles.service";
import { mapBackendPermissionsToModules, mapModulesToBackendPermissions } from "./roles.utils";
import { MODULES_CATALOG } from "./roles.constants";

const ROLES: RoleItem[] = [
  { id: "ROL-VEND", name: "Vendedor" },
  { id: "ROL-ADMIN", name: "Administrador" },
];

export function RolesPage() {
  const [roleId, setRoleId] = useState<string>(ROLES[0].id);
  const [permissions, setPermissions] = useState<ModulePermission[]>(MODULES_CATALOG);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const currentRole = useMemo(
    () => ROLES.find((r) => r.id === roleId),
    [roleId]
  );

  const loadPermissions = async (selectedRoleId: string) => {
    try {
      setLoading(true);

      const backendPerms = await getPermissionsByRole(selectedRoleId);
      const mappedPermissions = mapBackendPermissionsToModules(backendPerms);

      setPermissions(mappedPermissions);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron cargar los permisos del rol");
      setPermissions(MODULES_CATALOG);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPermissions(roleId);
  }, [roleId]);

  const handleToggle = (moduleKey: string, enabled: boolean) => {
    setPermissions((prev) =>
      prev.map((p) =>
        p.key === moduleKey
          ? {
              ...p,
              enabled,
            }
          : p
      )
    );
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      const permisos = mapModulesToBackendPermissions(permissions);

      await updatePermissionsByRole(roleId, { permisos });

      toast.success(`Permisos actualizados para ${currentRole?.name ?? roleId}`);
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron guardar los permisos");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Roles y Permisos</h2>
        <p className="text-gray-500">
          Defina qué módulos puede ver cada tipo de usuario.
        </p>
      </div>

      <RolePermissionsCard
        roles={ROLES}
        roleId={roleId}
        onRoleChange={setRoleId}
        permissions={permissions}
        onToggle={handleToggle}
        onSave={handleSave}
      />

      {loading && (
        <div className="text-sm text-gray-500">Cargando permisos...</div>
      )}

      {saving && (
        <div className="text-sm text-blue-900">Guardando cambios...</div>
      )}
    </div>
  );
}