import { http } from "../app/Shared/http";
import type { CreateSizeInput, SizeItem, UpdateSizeInput } from "../Modules/Tallas/sizes.types";

type RawSize = {
  talla: string;
  created_at?: string;
  updated_at?: string;
};

type ListSizesResponse = {
  success: boolean;
  message: string;
  data: {
    items: RawSize[];
    total: number;
    page: number;
    pages: number;
  };
};

type CreateOrUpdateResponse = {
  success?: boolean;
  message?: string;
  data?: RawSize;
};

function normalizeSize(item: RawSize, index = 0): SizeItem {
  return {
    id: `${item.talla}-${index}`,
    talla: item.talla,
  };
}

const MAX_PAGE_SIZE = 100;

export const sizesService = {
  async list(): Promise<SizeItem[]> {
    const first = await http.get<ListSizesResponse>("/tallas/listar", {
      params: { page: 1, limit: MAX_PAGE_SIZE },
    });

    const allRaw = [...(first?.data?.items ?? [])];
    const totalPages = first?.data?.pages ?? 1;

    for (let page = 2; page <= totalPages; page++) {
      const response = await http.get<ListSizesResponse>("/tallas/listar", {
        params: { page, limit: MAX_PAGE_SIZE },
      });
      allRaw.push(...(response?.data?.items ?? []));
    }

    return allRaw.map((item, index) => normalizeSize(item, index));
  },

  async create(payload: CreateSizeInput): Promise<SizeItem> {
    const response = await http.post<CreateOrUpdateResponse, CreateSizeInput>(
      "/tallas/create",
      { talla: payload.talla }
    );

    const item = response?.data ?? { talla: payload.talla };
    return normalizeSize(item);
  },

  async update(currentTalla: string, payload: UpdateSizeInput): Promise<SizeItem> {
    const response = await http.put<CreateOrUpdateResponse, { talla: string }>(
      `/tallas/actualizar/${encodeURIComponent(currentTalla)}`,
      { talla: payload.talla }
    );

    const item = response?.data ?? { talla: payload.talla };
    return normalizeSize(item);
  },

  async remove(currentTalla: string): Promise<void> {
    await http.del(`/tallas/eliminar/${encodeURIComponent(currentTalla)}`);
  },
};