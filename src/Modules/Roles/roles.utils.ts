import { BACK_TO_FRONT_PERMISSION, FRONT_TO_BACK_PERMISSION, MODULES_CATALOG } from "./roles.constants";
import type { ModulePermission } from "./roles.types";

export function mapBackendPermissionsToModules(permisosBackend: string[]): ModulePermission[] {
  const enabledKeys = new Set(
    permisosBackend
      .map((permiso) => BACK_TO_FRONT_PERMISSION[permiso])
      .filter(Boolean)
  );

  return MODULES_CATALOG.map((mod) => ({
    ...mod,
    enabled: enabledKeys.has(mod.key),
  }));
}

export function mapModulesToBackendPermissions(modules: ModulePermission[]): string[] {
  return modules
    .filter((mod) => mod.enabled)
    .map((mod) => FRONT_TO_BACK_PERMISSION[mod.key]);
}