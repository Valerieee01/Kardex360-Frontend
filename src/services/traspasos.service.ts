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
  referencia: string;
  descripcion: string;
  precio_base?: string | number;
  imagen_url?: string;
};

type WarehouseApiItem = {
  codigo_bodega?: string;
  code?: string;
  nombre_bodega?: string;
  name?: string;
  estado?: boolean;
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

function toNumber(value: any, fallback = 0): number {
  if (value === null || value === undefined || value === "") return fallback;
  const n = Number(value);
  return Number.isNaN(n) ? fallback : n;
}

export async function listProductsForTransferService(): Promise<InventoryTransferItem[]> {
  const response = await http.get<ApiResponse<ProductApiItem[]> | ProductApiItem[]>(
    "/productos/listar"
  );

  const items = extractItems<ProductApiItem>(response);

  return items.map((item, index) => ({
    id: String(item.referencia ?? index),
    ref: String(item.referencia ?? ""),
    desc: String(item.descripcion ?? ""),
    valor_unitario: toNumber(item.precio_base, 0),
    imagen_url: item.imagen_url ?? "",
  }));
}

export async function listWarehousesForTransferService(): Promise<Warehouse[]> {
  const response = await http.get<ApiResponse<WarehouseApiItem[]> | WarehouseApiItem[]>(
    "/bodegas/listar"
  );

  const items = extractItems<WarehouseApiItem>(response);

  return items
    .filter((item) => item.estado !== false)
    .map((item) => ({
      code: String(item.codigo_bodega ?? item.code ?? ""),
      name: String(item.nombre_bodega ?? item.name ?? ""),
    }));
}

export async function createTransferService(payload: CreateTransferPayload) {
  return await http.post("/movimientos/create", payload);
}