import { useEffect, useState } from "react";
import { toast } from "sonner";
import { TransferForm } from "./Componentes/TraspasosForm";
import type {
  CreateTransferPayload,
  InventoryTransferItem,
  Warehouse,
} from "./Traspasos.types";
import {
  createTransferService,
  listProductsForTransferService,
  listWarehousesForTransferService,
} from "../../../services/traspasos.service";

export function TransfersPage() {
  const [inventory, setInventory] = useState<InventoryTransferItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      setLoadingData(true);

      const [products, bodegas] = await Promise.all([
        listProductsForTransferService(),
        listWarehousesForTransferService(),
      ]);

      setInventory(products);
      setWarehouses(bodegas);
    } catch (error: any) {
      console.error("Error cargando datos de traspasos:", error);
      toast.error(
        error?.response?.data?.message || "No se pudieron cargar productos y bodegas"
      );
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTransfer = async (payload: CreateTransferPayload) => {
    try {
      setSaving(true);
      await createTransferService(payload);
      toast.success("Traspaso procesado correctamente");
      await loadData();
    } catch (error: any) {
      console.error("Error creando traspaso:", error);
      toast.error(
        error?.response?.data?.message || "No se pudo registrar el traspaso"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Traspasos entre Bodegas
        </h2>
        <p className="text-gray-500">
          Mueva stock de una ubicación a otra de forma segura.
        </p>
      </div>

      {loadingData ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
          <p className="text-gray-500">Cargando productos y bodegas...</p>
        </div>
      ) : (
        <TransferForm
          inventory={inventory}
          warehouses={warehouses}
          loading={saving}
          onCancel={() => toast("Traspaso cancelado")}
          onSubmit={handleTransfer}
        />
      )}
    </div>
  );
}