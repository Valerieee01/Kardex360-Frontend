export type ModuleKey =
  | "dashboard"
  | "inventory"
  | "sales"
  | "entries"
  | "transfers"
  | "movements"
  | "warehouses"
  | "users"
  | "roles"
  | "reports"
  | "settings"
  | "sizes";

export const MODULE_ROUTES: Record<ModuleKey, string> = {
  dashboard:  "/",
  inventory:  "/inventario",
  sales:      "/ventas",
  entries:    "/entradas",
  transfers:  "/traspasos",
  movements:  "/movimientos",
  warehouses: "/bodegas",
  sizes:      "/tallas",
  users:      "/usuarios",
  roles:      "/roles",
  reports:    "/reportes",
  settings:   "/configuracion",
};

export function moduleFromPath(pathname: string): ModuleKey {
  const entry = Object.entries(MODULE_ROUTES).find(([, path]) => path === pathname);
  return (entry?.[0] as ModuleKey) ?? "dashboard";
}
