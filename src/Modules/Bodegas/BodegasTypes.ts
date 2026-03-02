export type WarehouseItem = {
  code: string;
  name: string;
  location?: string | null;
  capacityPct?: number; // si luego lo conectas a backend o calculas
};