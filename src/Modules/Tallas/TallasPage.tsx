import React, { useMemo, useState } from "react";
import { toast } from "sonner";

import { Plus } from "lucide-react";
import { SizesToolbar } from "./Componentes/TallasToolBar";
import { SizesTable } from "./Componentes/TallasTables";
import type { SizeItem, SizeCategory, SizeStatus } from "./sizes.types";
import { AddSizeModal, type CreateSizeInput } from "./Componentes/AddSizeModal";


const SIZES_DATA: SizeItem[] = [
  {
    id: "1",
    code: "S",
    name: "Small",
    category: "Ropa",
    description: "Talla pequeña",
    status: "Activo",
  },
  {
    id: "2",
    code: "M",
    name: "Medium",
    category: "Ropa",
    description: "Talla mediana",
    status: "Activo",
  },
  {
    id: "3",
    code: "42",
    name: "42",
    category: "Calzado",
    description: "Talla 42",
    status: "Inactivo",
  },
  {
    id: "4",
    code: "N/A",
    name: "Sin talla",
    category: "Ropa",
    description: "No aplica",
    status: "Activo",
  },
];

export function SizesPage() {
      const [showAdd, setShowAdd] = useState(false);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<SizeCategory | "ALL">("ALL");
  const [status, setStatus] = useState<SizeStatus | "ALL">("ALL");

   const handleCreated = (created: CreateSizeInput) => {
    toast.success("Talla creada");
    // ✅ aquí luego actualizas tu estado o vuelves a llamar el GET /tallas/listar
    console.log("Nueva talla:", created);
  };

  // paginación simple (mock)
  const pageSize = 4;
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return SIZES_DATA.filter((s) => {
      const matchesQuery =
        !q ||
        s.code.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q);

      const matchesCategory = category === "ALL" ? true : s.category === category;
      const matchesStatus = status === "ALL" ? true : s.status === status;

      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [query, category, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const end = start + pageSize;
  const pageRows = filtered.slice(start, end);

  // si cambian filtros y quedas en página inválida
  React.useEffect(() => {
    setPage(1);
  }, [query, category, status]);

  const handleCreate = () => {
    // luego lo conectamos a un modal (igual que AddProductModal)
    console.log("Crear talla");
  };

  const handleEdit = (item: SizeItem) => {
    console.log("Editar", item);
  };

  const handleDelete = (item: SizeItem) => {
    console.log("Eliminar", item);
  };

  return (
   
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Catálogo de Tallas</h2>
          <p className="text-gray-500">Administre las tallas disponibles para sus productos.</p>
        </div>

         <button
        onClick={() => setShowAdd(true)}
        className="bg-blue-900 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2"
      >
        <Plus className="w-5 h-5" /> Crear Talla
      </button>

      <AddSizeModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={handleCreated}
      />
    
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <SizesToolbar
          query={query}
          onQueryChange={setQuery}
          category={category}
          onCategoryChange={setCategory}
          status={status}
          onStatusChange={setStatus}
        />

        <SizesTable rows={pageRows} onEdit={handleEdit} onDelete={handleDelete} />

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

            {/* Botones simples 1..totalPages (máx 5) */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => i + 1).map((p) => (
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