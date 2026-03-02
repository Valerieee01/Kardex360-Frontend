import { toast } from "sonner";
import { TransferForm } from "./Componentes/TraspasosForm";
import type { InventoryTransferItem, Warehouse } from "./Traspasos.types";

const INVENTORY_DATA: InventoryTransferItem[] = [
  { id: "1", ref: "REF-001", desc: "Camisa blanca", qty: 12 },
  { id: "2", ref: "REF-002", desc: "Pantalón negro", qty: 5 },
];

const WAREHOUSES: Warehouse[] = [
  { code: "BOD-01", name: "Principal" },
  { code: "BOD-02", name: "Secundaria" },
];

export function TransfersPage() {
  const handleTransfer = () => {
    toast.success("Traspaso procesado correctamente");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Traspasos entre Bodegas</h2>
        <p className="text-gray-500">Mueva stock de una ubicación a otra de forma segura.</p>
      </div>

      <TransferForm
        inventory={INVENTORY_DATA}
        warehouses={WAREHOUSES}
        onCancel={() => toast("Cancelado")}
        onSubmit={handleTransfer}
      />
    </div>
  );
}