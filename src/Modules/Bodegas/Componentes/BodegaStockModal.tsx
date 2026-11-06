import React, { useEffect, useState } from "react";
import { X, Package, Search } from "lucide-react";
import { warehouseService, type WarehouseStockItem } from "../../../services/bodegas.service";
import { ImageWithFallback } from "../../../app/components/figma/ImageWithFallback";
import type { WarehouseItem } from "../BodegasTypes";

type GroupedProduct = {
  referencia: string;
  descripcion: string;
  imagen_url: string | null;
  precio_base: number;
  tallas: { talla: string; cantidad: number }[];
  totalUnidades: number;
};

type Props = {
  open: boolean;
  warehouse: WarehouseItem | null;
  onClose: () => void;
};

export function BodegaStockModal({ open, warehouse, onClose }: Props) {
  const [items, setItems] = useState<WarehouseStockItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!open || !warehouse) return;
    setSearch("");
    setLoading(true);

    warehouseService
      .getStock(warehouse.code)
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [open, warehouse]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !warehouse) return null;

  const grouped: GroupedProduct[] = Object.values(
    items.reduce<Record<string, GroupedProduct>>((acc, item) => {
      if (!acc[item.referencia]) {
        acc[item.referencia] = {
          referencia: item.referencia,
          descripcion: item.productos.descripcion,
          imagen_url: item.productos.imagen_url,
          precio_base: item.productos.precio_base,
          tallas: [],
          totalUnidades: 0,
        };
      }
      acc[item.referencia].tallas.push({ talla: item.talla, cantidad: item.cantidad });
      acc[item.referencia].totalUnidades += item.cantidad;
      return acc;
    }, {})
  );

  const filtered = search.trim()
    ? grouped.filter(
        (p) =>
          p.descripcion.toLowerCase().includes(search.toLowerCase()) ||
          p.referencia.toLowerCase().includes(search.toLowerCase())
      )
    : grouped;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[85vh]">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between shrink-0">
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Stock — {warehouse.name}
              </h3>
              <p className="text-sm text-gray-500">
                {warehouse.code}
                {warehouse.location ? ` · ${warehouse.location}` : ""}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="px-6 pt-4 pb-2 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar por referencia o descripción..."
                className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
              />
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 pt-2 space-y-3">
            {loading ? (
              <div className="py-16 text-center text-gray-400 text-sm">
                Cargando stock...
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 flex flex-col items-center gap-3 text-gray-400">
                <Package className="w-10 h-10" />
                <p className="text-sm">
                  {search ? "Sin resultados para tu búsqueda." : "Esta bodega no tiene stock disponible."}
                </p>
              </div>
            ) : (
              filtered.map((product) => (
                <div
                  key={product.referencia}
                  className="flex items-start gap-4 p-4 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors"
                >
                  <ImageWithFallback
                    src={product.imagen_url ?? ""}
                    alt={product.descripcion}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 bg-gray-100"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {product.descripcion}
                        </p>
                        <p className="text-xs text-blue-900/60 font-medium mt-0.5">
                          {product.referencia}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs font-bold bg-blue-900 text-white px-2.5 py-1 rounded-full">
                        {product.totalUnidades} uds
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {product.tallas.map(({ talla, cantidad }) => (
                        <span
                          key={talla}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium text-gray-700"
                        >
                          <span>{talla}</span>
                          <span className="text-gray-400">·</span>
                          <span className="font-bold text-gray-900">{cantidad}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {!loading && filtered.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-100 shrink-0 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {filtered.length} producto{filtered.length !== 1 ? "s" : ""} ·{" "}
                {filtered.reduce((s, p) => s + p.totalUnidades, 0)} unidades en total
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
