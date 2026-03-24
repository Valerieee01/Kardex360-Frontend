export type ProductFormValues = {
  referencia: string;
  descripcion: string;
  imagen_url: string;
  precio_base: number | "";
  estado: boolean;
};

export type ProductItem = {
  referencia: string;
  descripcion: string;
  imagen_url: string;
  precio_base: number;
  estado: boolean;
};