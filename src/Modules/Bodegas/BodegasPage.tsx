import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { confirmDelete, successAlert, errorAlert } from "../../app/Shared/alerts";

import { WarehouseCard } from "./Componentes/BodegasCards";
import { AddWarehouseModal, type WarehouseCreateInput } from "./Componentes/AddBodegasModal";
import type { WarehouseItem } from "./BodegasTypes";
import { warehouseService } from "../../services/bodegas.service";

type Props = {
  onCreateWarehouse?: () => void;
};

export function WarehousesPage({ onCreateWarehouse }: Props) {
  const [warehouses, setWarehouses] = useState<WarehouseItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editingWarehouse, setEditingWarehouse] = useState<WarehouseItem | null>(null);

 const loadWarehouses = async () => {
  try {
    const data = await warehouseService.getAll();
    setWarehouses(data);
  } catch (error: any) {
    toast.error(error.message);
  }
};

  useEffect(() => {
    loadWarehouses();
  }, []);

  const handleCreate = async (created: WarehouseCreateInput) => {
  const newWarehouse = await warehouseService.create(created);

  setWarehouses((prev) => [newWarehouse, ...prev]);
  toast.success("Bodega creada");
};

  const handleUpdate = async (updated: WarehouseCreateInput) => {
  const warehouseUpdated = await warehouseService.update(updated.code!, updated);

  setWarehouses((prev) =>
    prev.map((w) => (w.code === updated.code ? warehouseUpdated : w))
  );

  toast.success("Bodega actualizada");
};

 const handleDelete = async (warehouse: WarehouseItem) => {
  const confirmed = await confirmDelete(
    `Se eliminará la bodega "${warehouse.name}". Esta acción no se puede deshacer.`
  );

  if (!confirmed) return;

  try {
    await warehouseService.remove(warehouse.code!);

    setWarehouses((prev) =>
      prev.filter((w) => w.code !== warehouse.code)
    );

    successAlert("Bodega eliminada correctamente");
  } catch (error: any) {
    errorAlert(error.message || "Error al eliminar la bodega");
  }
};

  const openCreateModal = () => {
    setEditingWarehouse(null);
    setShowModal(true);
  };

  const openEditModal = (warehouse: WarehouseItem) => {
    setEditingWarehouse(warehouse);
    setShowModal(true);
  };

  const handleSubmit = async (data: WarehouseCreateInput) => {
    if (editingWarehouse) {
      await handleUpdate({
        ...data,
        id: editingWarehouse.id,
      });
    } else {
      await handleCreate(data);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Bodegas</h2>
          <p className="text-gray-500">Administre las ubicaciones físicas de su inventario.</p>
        </div>

        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2.5 rounded-xl font-semibold"
        >
          <Plus className="w-4 h-4" />
          Nueva Bodega
        </button>
      </div>

      <AddWarehouseModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingWarehouse(null);
        }}
        onSubmit={handleSubmit}
        loading={loading}
        initialData={
          editingWarehouse
            ? {
                id: editingWarehouse.id,
                code: editingWarehouse.code,
                name: editingWarehouse.name,
                location: editingWarehouse.location,
                estado: editingWarehouse.estado,
              }
            : null
        }
      />

      {loading ? (
        <div className="text-center py-10 text-gray-500">Cargando bodegas...</div>
      ) : warehouses.length === 0 ? (
        <div className="text-center py-10 text-gray-500">No hay bodegas registradas.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {warehouses.map((w) => (
            <WarehouseCard
              key={w.id ?? w.code}
              warehouse={w}
              onEdit={openEditModal}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}