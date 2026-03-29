export type ProductFormValues = {
  referencia: string;
  descripcion: string;
  imagen_url: string; // base64 o "" al limpiar
  precio_base: number | "";
  estado: boolean;
};

export type ProductItem = {
  referencia: string;
  descripcion: string;
  imagen_url: string; // base64 que viene del backend
  precio_base: number;
  estado: boolean;
};