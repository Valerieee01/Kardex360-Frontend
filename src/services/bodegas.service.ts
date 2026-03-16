import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ejemplo: http://localhost:3000
});

export interface WarehouseDto {
  id_bodega: number;
  codigo: string;
  nombre: string;
  ubicacion: string;
}

export interface CreateWarehouseDto {
  codigo: string;
  nombre: string;
  ubicacion: string;
}

export interface UpdateWarehouseDto {
  codigo?: string;
  nombre?: string;
  ubicacion?: string;
}

export const warehouseService = {
  async getAll(): Promise<WarehouseDto[]> {
    const { data } = await API.get("/bodegas");
    return data;
  },

  async create(payload: CreateWarehouseDto): Promise<WarehouseDto> {
    const { data } = await API.post("/bodegas", payload);
    return data;
  },

  async update(id: number, payload: UpdateWarehouseDto): Promise<WarehouseDto> {
    const { data } = await API.put(`/bodegas/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await API.delete(`/bodegas/${id}`);
  },
};