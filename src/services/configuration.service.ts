import { http } from "../app/Shared/http";

export type ConfiguracionItem = {
  identificacion: string;
  nombre_sistema: string;
  ubicacion: string;
  created_at?: string;
  updated_at?: string;
};

export type ConfiguracionResponse = {
  success: boolean;
  message: string;
  data: ConfiguracionItem[];
};

export function normalizeIdentificacion(value: string) {
  return value.replace(/\D/g, "");
}

export async function getConfiguracion() {
  return await http.get<ConfiguracionResponse>("/configuracion/listar");
}

export async function crearConfiguracion(payload: {
  identificacion: string;
  nombre_sistema: string;
  ubicacion: string;
}) {
  return await http.post("/configuracion/crear", payload);
}

export async function actualizarConfiguracion(
  identificacion: string,
  payload: {
    nombre_sistema: string;
    ubicacion: string;
  }
) {
  return await http.put(`/configuracion/actualizar/${identificacion}`, payload);
}