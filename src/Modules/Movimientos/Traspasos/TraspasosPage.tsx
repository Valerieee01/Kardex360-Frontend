import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { TransferForm } from "./Componentes/TraspasosForm";
import type {
  CreateTransferPayload,
  InventoryTransferItem,
  SizeItem,
  Warehouse,
} from "./Traspasos.types";
import {
  createTransferService,
  listProductsForTransferService,
  listSizesForTransferService,
  listWarehousesForTransferService,
} from "../../../services/traspasos.service";

export function TransfersPage() {
  const [inventory, setInventory] = useState<InventoryTransferItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [sizes, setSizes] = useState<SizeItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [saving, setSaving] = useState(false);

  const responsable = useMemo(() => {
    return (
      localStorage.getItem("id_usuario") ||
      localStorage.getItem("identificacion") ||
      localStorage.getItem("userId") ||
      sessionStorage.getItem("id_usuario") ||
      ""
    );
  }, []);

  const loadData = async () => {
    try {
      setLoadingData(true);

      const [products, bodegas, tallas] = await Promise.all([
        listProductsForTransferService(),
        listWarehousesForTransferService(),
        listSizesForTransferService(),
      ]);

      setInventory(products);
      setWarehouses(bodegas);
      setSizes(tallas);
    } catch (error: any) {
      console.error("Error cargando datos de traspasos:", error);
      toast.error(
        error?.response?.data?.message ||
          "No se pudieron cargar productos, bodegas y tallas"
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

      let backendMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "No se pudo registrar el traspaso";

      if (backendMessage.startsWith("No existe stock para")) {
        const raw = backendMessage.replace("No existe stock para", "").trim();
        const [bodega, referencia, talla] = raw.split(" - ");
        backendMessage = `No hay stock disponible para la bodega ${bodega}, producto ${referencia}, talla ${talla}.`;
      }

      toast.error(backendMessage);
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
          <p className="text-gray-500">Cargando productos, bodegas y tallas...</p>
        </div>
      ) : (
        <TransferForm
          inventory={inventory}
          warehouses={warehouses}
          sizes={sizes}
          responsable={responsable}
          loading={saving}
          onCancel={() => toast("Traspaso cancelado")}
          onSubmit={handleTransfer}
        />
      )}
    </div>
  );
}