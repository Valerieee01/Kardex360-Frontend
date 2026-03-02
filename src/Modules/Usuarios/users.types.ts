export type UserStatus = "Activo" | "Inactivo";

export type UserItem = {
  id: string;
  name: string;
  role: string;
  status: UserStatus;
};