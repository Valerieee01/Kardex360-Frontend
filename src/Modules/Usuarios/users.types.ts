export type UserItem = {
  id: string;
  identificacion: string;
  name: string;
  role: string;
  status: "Activo" | "Inactivo";
};

export type CreateUserRequest = {
  identificacion: string;
  nombre_completo: string;
  estado: boolean;
  password: string;
  roles: string[];
};

export type CreateUserInput = {
  identificacion: string;
  nombre_completo: string;
  role: string;
  password: string;
};

export type UserApiResponse = {
  identificacion: string;
  nombre_completo: string;
  estado: boolean;
  roles: string[];
};