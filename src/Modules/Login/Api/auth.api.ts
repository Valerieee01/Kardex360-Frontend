import { http, authTokens } from "../../../app/Shared/http";
import { getPermissionsByRole } from "../../../services/roles.service"
import { setStoredUser } from "../../../app/Shared/session";

export type LoginBody = {
  identification: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    user: {
      id: string;
      nombre: string;
      roles: string[];
    };
  };
};

export async function login(body: LoginBody) {
  const res = await http.post<LoginResponse, LoginBody>("/auth/login", body, {
    auth: false,
  });

  authTokens.set({ accessToken: res.data.accessToken });

  const baseUser = res.data.user;

  let permisos: string[] = [];

  try {
    const mainRole = baseUser.roles?.[0];

    if (mainRole) {
      permisos = await getPermissionsByRole(mainRole);
    }
  } catch (error) {
    console.error("No se pudieron cargar los permisos del rol", error);
  }

  setStoredUser({
    ...baseUser,
    permisos,
  });

  return res;
}

export function logout() {
  authTokens.clear();
  localStorage.removeItem("kardex.user");
}