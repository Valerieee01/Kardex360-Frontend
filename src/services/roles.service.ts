import { http } from "../app/Shared/http";

type RolePermissionsResponse = {
  success?: boolean;
  message?: string;
  data?: {
    permisos?: string[];
  };
  permisos?: string[];
};

type UpdateRolePermissionsPayload = {
  permisos: string[];
};

export async function getPermissionsByRole(codigoRol: string): Promise<string[]> {
  const data = await http.get<RolePermissionsResponse>(
    `/permisos/roles/${codigoRol}/permisos`
  );

  return data?.data?.permisos ?? data?.permisos ?? [];
}

export async function updatePermissionsByRole(
  codigoRol: string,
  payload: UpdateRolePermissionsPayload
): Promise<void> {
  await http.put<void, UpdateRolePermissionsPayload>(
    `/permisos/roles/${codigoRol}/permisos`,
    payload
  );
}