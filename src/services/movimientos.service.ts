import { http } from "../app/Shared/http";
import type {
  CreateMovementPayload,
  MovementApiItem,
  UpdateMovementPayload,
} from "../Modules/Movimientos/Ventas/ventas.types";

type ApiResponse<T> = {
  success?: boolean;
  message?: string;
  data?: T;
};

type ProductosResponseItem = {
  id?: string | number;
  referencia?: string;
  codigo?: string;
  descripcion?: string;
  nombre?: string;
  precio_base?: string | number;
  imagen_url?: string;
};

type BodegasResponseItem = {
  codigo?: string;
  code?: string;
  nombre?: string;
  name?: string;
  codigo_bodega?: string;
  nombre_bodega?: string;
  estado?: boolean;
};

export async function listProductsForMovementService() {
  const response = await http.get<ApiResponse<{ items?: ProductosResponseItem[] } | ProductosResponseItem[]>>(
    "/productos/listar"
  );

  const raw =
    (response.data as any)?.items ||
    response.data ||
    [];

  return (raw as ProductosResponseItem[]).map((item, index) => ({
    id: String(item.id ?? index + 1),
    ref: item.referencia ?? item.codigo ?? "",
    desc: item.descripcion ?? item.nombre ?? "",
    precio_base: item.precio_base !== undefined ? Number(item.precio_base) : undefined,
    imagen_url: item.imagen_url ?? "",
  }));
}

export async function listWarehousesForMovementService() {
  const response = await http.get<ApiResponse<{ items?: BodegasResponseItem[] } | BodegasResponseItem[]>>(
    "/bodegas/listar"
  );

  const raw =
    (response.data as any)?.items ||
    response.data ||
    [];

  return (raw as BodegasResponseItem[])
    .map((item) => ({
      code: item.codigo ?? item.code ?? item.codigo_bodega ?? "",
      name: item.nombre ?? item.name ?? item.nombre_bodega ?? "",
      estado: item.estado,
    }))
    .filter((item) => item.code && item.name && item.estado !== false)
    .map(({ estado: _, ...w }) => w);
}

export async function listMovementsService(
  tipo?: "VENTA" | "ENTRADA" | "TRASPASO"
) {
  const query = tipo ? `?tipo=${tipo}` : "";

  const response = await http.get<
    ApiResponse<MovementApiItem[]>
  >(`/movimientos/listar${query}`);

  const data = response.data || [];

  return data;
}

export async function createMovementService(payload: CreateMovementPayload) {
  return await http.post("/movimientos/create", payload);
}

export async function updateMovementService(
  codigoMovimiento: string,
  payload: UpdateMovementPayload
) {
  return await http.put(`/movimientos/actualizar/${codigoMovimiento}`, payload);
}

export async function annulMovementService(
  codigoMovimiento: string,
  motivo: string
) {
  return await http.post(`/movimientos/${codigoMovimiento}/anular`, {
    codigo_movimiento: codigoMovimiento,
    motivo,
  });
}