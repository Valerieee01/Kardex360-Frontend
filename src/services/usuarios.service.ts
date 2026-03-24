import { http } from "../app/Shared/http";
import type {
  CreateUserRequest,
  UserApiResponse,
} from "../Modules/Usuarios/users.types";

// 🔹 Crear usuario
export async function createUserService(payload: CreateUserRequest) {
  return await http.post("/users/crear", payload);
}

// 🔹 Listar usuarios
export async function listUsersService(): Promise<UserApiResponse[]> {
  const response = await http.get<any>("/users/listar");

  // tu backend puede venir así:
  // { data: { items: [] } } o { data: [] }
  return response.data?.items || response.data || [];
}

// 🔹 Activar / Inactivar usuario
export async function updateUserStatusService(
  identificacion: string,
  estado: boolean
) {
  return await http.put(`/users/modificar/${identificacion}`, {
    estado,
  });
}



type UpdateUserPayload = {
  nombre_completo: string;
  estado: boolean;
  roles: string[];
  password?: string;
};

export async function updateUserService(
  identificacion: string,
  payload: UpdateUserPayload
) {
  return await http.put(`/users/modificar/${identificacion}`, payload);
}