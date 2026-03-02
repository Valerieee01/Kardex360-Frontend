import { Plus } from "lucide-react";
import { WarehouseCard } from "./Componentes/BodegasCards";
import type { WarehouseItem } from "./BodegasTypes";
import React, { useState } from "react";
import { toast } from "sonner";
import { AddWarehouseModal, type WarehouseCreateInput } from "./Componentes/AddBodegasModal";

const WAREHOUSES: WarehouseItem[] = [
  { code: "BOD-01", name: "Principal", location: "Barranquilla" },
  { code: "BOD-02", name: "Sucursal Centro", location: "Centro" },
  { code: "BOD-03", name: "Bodega Norte", location: "Norte" },
];

type Props = {
  // ✅ opcional: si luego quieres abrir modal desde layout
  onCreateWarehouse?: () => void;
};
const handleCreated = (created: WarehouseCreateInput) => {
    toast.success("Bodega creada");
    console.log("Nueva bodega:", created);

    // ✅ Luego: acá refrescas lista (GET /bodegas/listar) o agregas al estado local
  };

export function WarehousesPage({ onCreateWarehouse }: Props) {
      const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Bodegas</h2>
          <p className="text-gray-500">Administre las ubicaciones físicas de su inventario.</p>
        </div>

       <>
      {/* ...tu header */}
      <button
        onClick={() => setShowAdd(true)}
        className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2.5 rounded-xl font-semibold"
      >
        Nueva Bodega
      </button>

      <AddWarehouseModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={handleCreated}
      />
    </>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {WAREHOUSES.map((w) => (
          <WarehouseCard key={w.code} warehouse={w} />
        ))}
      </div>
    </div>
  );
}