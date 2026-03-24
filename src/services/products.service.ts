import { http } from "../app/Shared/http";

export type ProductApiItem = {
  referencia: string;
  descripcion: string;
  imagen_url: string | null;
  precio_base: number;
  estado: boolean;
};

export type CreateProductRequest = {
  referencia: string;
  descripcion: string;
  imagen_url?: string | null;
  precio_base: number;
  estado: boolean;
};

export type UpdateProductRequest = Partial<CreateProductRequest>;

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

// Crear producto
export async function createProductService(payload: CreateProductRequest) {
  const response = await http.post<ApiResponse<ProductApiItem>>(
    "/productos/crear",
    payload
  );
  return response.data;
}

// Listar productos
export async function listProductsService(): Promise<ProductApiItem[]> {
  const response = await http.get<ApiResponse<ProductApiItem[] | { items: ProductApiItem[] }>>(
    "/productos/listar"
  );

  const data = response.data;

  if (Array.isArray(data)) return data;
  if (data && "items" in data && Array.isArray(data.items)) return data.items;

  return [];
}

// Obtener producto por referencia
export async function getProductByReferenceService(referencia: string) {
  const response = await http.get<ApiResponse<ProductApiItem>>(
    `/productos/${referencia}`
  );
  return response.data;
}

// Actualizar producto
export async function updateProductService(
  referencia: string,
  payload: UpdateProductRequest
) {
  const response = await http.put<ApiResponse<ProductApiItem>>(
    `/productos/${referencia}`,
    payload
  );
  return response.data;
}

// Eliminar producto
/*
export async function deleteProductService(referencia: string) {
  const response = await http.delete<ApiResponse<null>>(
    `/productos/eliminar/${referencia}`
  );
  return response.data;
}*/

// Clonar producto
export async function cloneProductService(
  referenciaOrigen: string,
  nuevaReferencia: string
) {
  const producto = await getProductByReferenceService(referenciaOrigen);

  const payload: CreateProductRequest = {
    referencia: nuevaReferencia,
    descripcion: `${producto.descripcion} (Copia)`,
    imagen_url: producto.imagen_url,
    precio_base: producto.precio_base,
    estado: producto.estado,
  };

  return await createProductService(payload);
}