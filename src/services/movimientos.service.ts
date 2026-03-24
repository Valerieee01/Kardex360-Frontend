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
};

type BodegasResponseItem = {
  codigo?: string;
  code?: string;
  nombre?: string;
  name?: string;
  codigo_bodega?: string;
  nombre_bodega?: string;
};

export async function listProductsForMovementService() {
  const response = await http.get<ApiResponse<{ items?: ProductosResponseItem[] } | ProductosResponseItem[]>>(
    "/productos/listar"
  );

  const raw =
    (response.data as any)?.items ||
    response.data||
    [];

  return (raw as ProductosResponseItem[]).map((item, index) => ({
    id: String(item.id ?? index + 1),
    ref: item.referencia ?? item.codigo ?? "",
    desc: item.descripcion ?? item.nombre ?? "",
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
    }))
    .filter((item) => item.code && item.name);
}

export async function listMovementsService(tipo?: "VENTA" | "ENTRADA" | "TRASPASO") {
  const query = tipo ? `?tipo=${tipo}` : "";
  const response = await http.get(`/movimientos/listar`);

  const data =
    response ||
    [];

  return Array.isArray(data) ? (data as MovementApiItem[]) : [];
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
  return await http.put(`/movimientos/${codigoMovimiento}/anular`, {
    codigo_movimiento: codigoMovimiento,
    motivo,
  });
}