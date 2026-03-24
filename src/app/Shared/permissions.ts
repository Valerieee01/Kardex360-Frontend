import type { SessionUser } from "./session";

export function hasPermission(user: SessionUser | null, permiso: string) {
  return !!user?.permisos?.includes(permiso);
}