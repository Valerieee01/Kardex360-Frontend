import type { ModulePermission, ModuleKey } from "./roles.types";

export const MODULES_CATALOG: ModulePermission[] = [
  {
    key: "inventory",
    label: "Inventario",
    description: "Acceso al módulo de inventario",
    enabled: false,
  },
  {
    key: "sales",
    label: "Ventas",
    description: "Acceso al módulo de ventas",
    enabled: false,
  },
  {
    key: "transfers",
    label: "Traspasos",
    description: "Acceso al módulo de traspasos",
    enabled: false,
  },
  {
    key: "reports",
    label: "Reportes",
    description: "Acceso al módulo de reportes",
    enabled: false,
  },
  {
    key: "settings",
    label: "Configuración",
    description: "Acceso al módulo de configuración",
    enabled: false,
  },
];

export const FRONT_TO_BACK_PERMISSION: Record<ModuleKey, string> = {
  inventory: "PERM-INVENT",
  sales: "PERM-VENTAS",
  transfers: "PERM-TRASP",
  reports: "PERM-REPORT",
  settings: "PERM-CONFIG",
};

export const BACK_TO_FRONT_PERMISSION: Record<string, ModuleKey> = {
  "PERM-INVENT": "inventory",
  "PERM-VENTAS": "sales",
  "PERM-TRASP": "transfers",
  "PERM-REPORT": "reports",
  "PERM-CONFIG": "settings",
};