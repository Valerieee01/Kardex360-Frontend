export type WarehouseItem = {
  id?: number | string;
  code: string;
  name: string;
  location?: string;
  estado: boolean;
  capacityPct?: number;
};

export type WarehouseApi = {
  id?: number | string;
  codigo_bodega: string;
  nombre_bodega: string;
  ubicacion?: string;
  estado: boolean;
};
