export type SizeStatus = "Activo" | "Inactivo";
export type SizeCategory = "Ropa" | "Calzado";

export type SizeItem = {
  id: string;
  code: string;
  name: string;
  category: SizeCategory;
  description: string;
  status: SizeStatus;
};