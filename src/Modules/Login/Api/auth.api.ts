import { http, authTokens } from "../../../app/Shared/http";

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
    auth: false, // login NO lleva token
  });

  // guardar token (lo usará tu http.ts automáticamente en las siguientes requests)
  authTokens.set({ accessToken: res.data.accessToken });

  // opcional: guardar user (por si quieres mostrar nombre en UI)
  localStorage.setItem("kardex.user", JSON.stringify(res.data.user));

  return res;
}

export function logout() {
  authTokens.clear();
  localStorage.removeItem("kardex.user");
}