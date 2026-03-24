export type MovementType = "VENTA" | "ENTRADA" | "TRASPASO";

export type Warehouse = {
  code: string;
  name: string;
};

export type InventoryItem = {
  id: string;
  ref: string;
  desc: string;
};

export type MovementDetailForm = {
  id: string;
  referencia: string;
  talla: string;
  cantidad: number;
  valor_unitario: number;
};

export type CreateMovementPayload = {
  codigo_movimiento: string;
  tipo: "VENTA" | "ENTRADA";
  responsable: string;
  bodega_origen: string | null;
  bodega_destino: string | null;
  observacion: string;
  detalle: Array<{
    referencia: string;
    talla: string;
    cantidad: number;
    valor_unitario: number;
  }>;
};

export type UpdateMovementPayload = CreateMovementPayload;

export type MovementApiItem = {
  codigo_movimiento: string;
  tipo: MovementType;
  fecha?: string;
  responsable: string;
  bodega_origen: string | null;
  bodega_destino: string | null;
  observacion: string;
  created_at?: string;
  updated_at?: string;
  estado?: boolean | string;
  anulado_at?: string | null;
  anulado_por?: string | null;
  anulado_motivo?: string | null;
  movimiento_detalle?: Array<{
    codigo_movimiento: string;
    item: number;
    referencia: string;
    talla: string;
    cantidad: number;
    valor_unitario: string | number;
    created_at?: string;
  }>;
  usuarios?: {
    identificacion: string;
    nombre_completo: string;
  };
};

export type SaleRow = {
  id: string;
  codigo_movimiento: string;
  tipo: MovementType;
  responsable: string;
  ref: string;
  qty: number;
  price: number;
  total: number;
  warehouse: string;
  date: string;
  estado: string;
  observacion?: string;
};