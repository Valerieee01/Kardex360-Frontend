export type InventoryTransferItem = {
  id: string;
  ref: string;
  desc: string;
  valor_unitario: number;
};

export type Warehouse = {
  code: string;
  name: string;
};

export type SizeItem = {
  value: string;
  label: string;
};

export type TransferDetail = {
  referencia: string;
  talla: string;
  cantidad: number;
  valor_unitario: number;
};

export type CreateTransferPayload = {
  codigo_movimiento: string;
  tipo: "TRASPASO";
  responsable: string;
  bodega_origen: string;
  bodega_destino: string;
  observacion: string;
  detalle: TransferDetail[];
};