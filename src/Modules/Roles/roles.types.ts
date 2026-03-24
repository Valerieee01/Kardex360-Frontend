export type ModuleKey =
  | "inventory"
  | "sales"
  | "transfers"
  | "reports"
  | "settings";

export type ModulePermission = {
  key: ModuleKey;
  label: string;
  description: string;
  enabled: boolean;
};

export type RoleItem = {
  id: string;
  name: string;
};

export type RolePermissionsResponse = {
  success?: boolean;
  message?: string;
  data?: {
    permisos?: string[];
  };
  permisos?: string[];
};

export type UpdateRolePermissionsPayload = {
  permisos: string[];
};