import React, { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { confirmDelete, successAlert, errorAlert } from "../../app/Shared/alerts";

import { SizesToolbar } from "./Componentes/TallasToolBar";
import { SizesTable } from "./Componentes/TallasTables";
import { AddSizeModal } from "./Componentes/AddSizeModal";
import { EditSizeModal } from "./Componentes/EditSizeModal";
import { sizesService } from "../../services/sizes.service";
import type { SizeItem } from "./sizes.types";

export function SizesPage() {
  const [showAdd, setShowAdd] = useState(false);
  const [editingItem, setEditingItem] = useState<SizeItem | null>(null);
  const [query, setQuery] = useState("");
  const [sizes, setSizes] = useState<SizeItem[]>([]);
  const [loading, setLoading] = useState(false);

  const pageSize = 4;
  const [page, setPage] = useState(1);

  const loadSizes = async () => {
    try {
      setLoading(true);
      const data = await sizesService.list();
      setSizes(Array.isArray(data) ? data : []);
    } catch (error: any) {
      console.error("Error listando tallas:", error);
      toast.error(error?.message || "No se pudieron cargar las tallas");
      setSizes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSizes();
  }, []);

  const handleCreated = (created: SizeItem) => {
    setSizes((prev) => [created, ...prev]);
    setPage(1);
  };

  const handleUpdated = (updated: SizeItem, previousTalla: string) => {
    setSizes((prev) =>
      prev.map((item) =>
        item.talla === previousTalla ? { ...item, talla: updated.talla } : item
      )
    );
  };

  
const handleDelete = async (item: SizeItem) => {
  const ok = await confirmDelete(`Se eliminará la talla "${item.talla}"`);

  if (!ok) return;

  try {
    await sizesService.remove(item.talla);

    setSizes((prev) => prev.filter((x) => x.talla !== item.talla));

    successAlert("Talla eliminada correctamente");
  } catch (error: any) {
    console.error("Error eliminando talla:", error);
    errorAlert(error?.message || "No se pudo eliminar la talla");
  }
};

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const safeSizes = Array.isArray(sizes) ? sizes : [];

    return safeSizes.filter((s) =>
      !q ? true : (s.talla ?? "").toLowerCase().includes(q)
    );
  }, [query, sizes]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = filtered.slice(start, end);

  useEffect(() => {
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Catálogo de Tallas</h2>
          <p className="text-gray-500">
            Administre las tallas disponibles para sus productos.
          </p>
        </div>

        <button
          onClick={() => setShowAdd(true)}
          className="bg-blue-900 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Crear Talla
        </button>
      </div>

      <AddSizeModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={handleCreated}
        loading={loading}
      />

      <EditSizeModal
        open={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onUpdated={handleUpdated}
      />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SizesToolbar query={query} onQueryChange={setQuery} />

        <SizesTable
          rows={pageRows}
          onEdit={(item) => setEditingItem(item)}
          onDelete={handleDelete}
        />

        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Mostrando {filtered.length === 0 ? 0 : start + 1}-{Math.min(end, filtered.length)} de{" "}
            {filtered.length} tallas
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 disabled:opacity-50"
            >
              Anterior
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={
                  p === safePage
                    ? "px-3 py-1 bg-blue-900 text-white rounded-md text-sm"
                    : "px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600"
                }
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}