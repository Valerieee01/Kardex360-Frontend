import { toast } from "sonner";
import { SalesForm } from "./Componentes/VentasFrm";
import { RecentSalesTable } from "./Componentes/VentasRecientesTables";
import type { Warehouse, InventoryItem, SaleRow } from "./ventas.types";

// ✅ Si todavía estás usando data mock, déjala aquí o en sales.mock.ts
// Luego la cambias por llamadas al backend sin romper UI.
const INVENTORY_DATA: InventoryItem[] = [
  { id: "1", ref: "REF-001", desc: "Camisa blanca" },
  { id: "2", ref: "REF-002", desc: "Pantalón negro" },
];

const WAREHOUSES: Warehouse[] = [
  { code: "BOD-01", name: "Principal" },
  { code: "BOD-02", name: "Secundaria" },
];

const SALES_DATA: SaleRow[] = [
  { id: "1", ref: "REF-001", qty: 2, price: 120000, date: "2026-03-01" },
  { id: "2", ref: "REF-002", qty: 1, price: 80000, date: "2026-02-28" },
];

export function SalesPage() {
  // ✅ Por ahora solo toast (luego aquí conectamos POST /movimientos tipo VENTA)
  const handleConfirmSale = () => {
    toast.success("Venta registrada con éxito. Stock actualizado.");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Nueva Venta</h2>
          <p className="text-gray-500">Registre una salida de inventario por venta.</p>
        </div>

        <SalesForm
          inventory={INVENTORY_DATA}
          warehouses={WAREHOUSES}
          onConfirm={handleConfirmSale}
        />
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ventas Recientes</h2>
          <p className="text-gray-500">Historial de las últimas operaciones de venta.</p>
        </div>

        <RecentSalesTable
          rows={SALES_DATA}
          onViewFullReport={() => toast("Abrir reporte completo (pendiente)")}
        />
      </div>
    </div>
  );
}