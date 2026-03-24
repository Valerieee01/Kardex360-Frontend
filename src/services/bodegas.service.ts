import { http } from "../app/Shared/http"; // ajusta la ruta si cambia
import type { WarehouseItem, WarehouseApi } from "../Modules/Bodegas/BodegasTypes";

// 🔄 Mappers
function mapApiToUi(item: WarehouseApi): WarehouseItem {
  return {
    id: item.id,
    code: item.codigo_bodega,
    name: item.nombre_bodega,
    location: item.ubicacion,
    estado: item.estado,
  };
}

function mapUiToApi(item: Partial<WarehouseItem>): Partial<WarehouseApi> {
  return {
    codigo_bodega: item.code,
    nombre_bodega: item.name,
    ubicacion: item.location,
    estado: item.estado,
  };
}

export const warehouseService = {
  async getAll(): Promise<WarehouseItem[]> {
    const res = await http.get<any>("/bodegas/listar");

    const items = res.data ?? res;

    return items.map(mapApiToUi);
  },

  async create(payload: WarehouseItem): Promise<WarehouseItem> {
    const res = await http.post<any>("/bodegas/crear", mapUiToApi(payload));

    return mapApiToUi(res.data ?? res);
  },

  async update(id: number | string, payload: WarehouseItem): Promise<WarehouseItem> {
    const res = await http.put<any>(
      `/bodegas/actualizar/${id}`,
      mapUiToApi(payload)
    );

    return mapApiToUi(res.data ?? res);
  },

  async remove(id: number | string): Promise<void> {
    await http.del(`/bodegas/eliminar/${id}`);
  },
};