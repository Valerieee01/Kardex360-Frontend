import { http } from "../app/Shared/http";
import type {
  CreateTransferPayload,
  InventoryTransferItem,
  Warehouse,
} from "../Modules/Movimientos/Traspasos/Traspasos.types";

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type ProductApiItem = {
  id_producto?: string | number;
  codigo?: string;
  referencia?: string;
  nombre?: string;
  descripcion?: string;
  stock?: number;
  cantidad?: number;
  talla?: string;
  valor_unitario?: number;
  precio?: number;
  precio_venta?: number;
};

type WarehouseApiItem = {
  codigo?: string;
  codigo_bodega: string;
  nombre_bodega: string;
  name?: string;
};

function extractItems<T>(response: any): T[] {
  return (
    response?.data?.data?.items ||
    response?.data?.data ||
    response?.data?.items ||
    response?.data ||
    []
  );
}

export async function listProductsForTransferService(): Promise<InventoryTransferItem[]> {
  const response = await http.get<ApiResponse<{ items: ProductApiItem[] }> | ProductApiItem[]>(
    "/productos/listar"
  );

  const items = extractItems<ProductApiItem>(response);

  return items.map((item, index) => ({
    id: String(item.id_producto ?? item.codigo ?? item.referencia ?? index),
    ref: String(item.referencia ?? item.codigo ?? ""),
    desc: String(item.descripcion ?? item.nombre ?? ""),
    qty: Number(item.stock ?? item.cantidad ?? 0),
    talla: String(item.talla ?? "N/A"),
    valor_unitario: Number(
      item.valor_unitario ?? item.precio_venta ?? item.precio ?? 0
    ),
  }));
}

export async function listWarehousesForTransferService(): Promise<Warehouse[]> {
  const response = await http.get<ApiResponse<{ items: WarehouseApiItem[] }> | WarehouseApiItem[]>(
    "/bodegas/listar"
  );

  const items = extractItems<WarehouseApiItem>(response);

  return items.map((item) => ({
    code: String(item.codigo_bodega ?? item.codigo ?? ""),
    name: String(item.nombre_bodega ?? item.name ?? ""),
  }));
}

export async function createTransferService(payload: CreateTransferPayload) {
  return await http.post("/movimientos/crear", payload);
}