export type RoleItem = {
  id: string;
  name: string;
};

export type ModulePermission = {
  key: string;        // ej: "inventory"
  label: string;      // ej: "Inventario"
  description: string;// ej: "Ver, Editar, Crear"
  enabled: boolean;
};