import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";
import { SalesForm } from "./Componentes/VentasFrm";
import { MovimientosTableModal } from "../Componentes/MovimientosTableModal";
import type {
  CreateMovementPayload,
  InventoryItem,
  MovementApiItem,
  SaleRow,
  Warehouse,
} from "./ventas.types";
import type { SizeItem } from "../../Tallas/sizes.types";
import {
  annulMovementService,
  createMovementService,
  listMovementsService,
  listProductsForMovementService,
  listWarehousesForMovementService,
} from "../../../services/movimientos.service";
import { sizesService } from "../../../services/sizes.service";
import { getCurrentUserId } from "../../../app/Shared/auth";
import { normalizeMovementRows, getApiSuccess, getApiMessage, buildMovementCode } from "../movimientos.utils";
import { confirmWithReason } from "../../../app/Shared/alerts";

type Props = {
  editingMovement?: MovementApiItem | null;
  onClearEdit?: () => void;
};

export function SalesPage({ editingMovement: externalEditing, onClearEdit }: Props) {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [sizes, setSizes] = useState<SizeItem[]>([]);
  const [tableRows, setTableRows] = useState<SaleRow[]>([]);
  const [inventoryMap, setInventoryMap] = useState<Map<string, { imagen_url: string; desc: string }>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showTable, setShowTable] = useState(false);
  const [internalEditing, setInternalEditing] = useState<MovementApiItem | null>(null);
  const [isCorrection, setIsCorrection] = useState(false);
  const [originalCode, setOriginalCode] = useState<string | undefined>();

  const activeEditing = internalEditing ?? externalEditing ?? null;
  const currentUserId = getCurrentUserId();

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [productsData, warehousesData, sizesData, movementsData] = await Promise.all([
        listProductsForMovementService(),
        listWarehousesForMovementService(),
        sizesService.list(),
        listMovementsService("VENTA"),
      ]);
      const imgMap = new Map(productsData.map((p) => [p.ref, { imagen_url: p.imagen_url ?? "", desc: p.desc ?? "" }]));
      setInventory(productsData);
      setInventoryMap(imgMap);
      setWarehouses(warehousesData);
      setSizes(sizesData);
      setTableRows(normalizeMovementRows(movementsData, imgMap));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "No se pudieron cargar los datos.");
    } finally {
      setLoading(false);
    }
  };

  const reloadMovements = async () => {
    try {
      const data = await listMovementsService("VENTA");
      setTableRows(normalizeMovementRows(data, inventoryMap));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "No se pudo actualizar el listado.");
    }
  };

  useEffect(() => { loadInitialData(); }, []);

  const handleSubmitMovement = async (payload: CreateMovementPayload) => {
    try {
      const response: any = await createMovementService(payload);
      const success = getApiSuccess(response);
      const message = getApiMessage(response, "Venta registrada con éxito.");
      if (success === false) { toast.error(message); return; }
      toast.success(message);
      setInternalEditing(null);
      setIsCorrection(false);
      setOriginalCode(undefined);
      onClearEdit?.();
      await reloadMovements();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "No se pudo guardar la venta.");
      throw error;
    }
  };

  const handleCorrect = async (codigoMovimiento: string) => {
    const motivo = await confirmWithReason(
      "Corregir venta",
      "Se anulará el movimiento original y se abrirá un formulario pre-llenado para que corrijas el error.",
      "Ej: Bodega incorrecta..."
    );
    if (!motivo) return;

    try {
      const annulRes: any = await annulMovementService(codigoMovimiento, motivo);
      if (getApiSuccess(annulRes) === false) {
        toast.error(getApiMessage(annulRes, "No se pudo anular el movimiento."));
        return;
      }

      const allData = await listMovementsService("VENTA");
      const original = allData.find((m) => m.codigo_movimiento === codigoMovimiento);
      if (!original) { toast.error("No se encontró el movimiento original."); return; }

      setOriginalCode(codigoMovimiento);
      setInternalEditing({ ...original, codigo_movimiento: buildMovementCode("VENTA") });
      setIsCorrection(true);
      await reloadMovements();
      window.scrollTo({ top: 0, behavior: "smooth" });
      toast.info("Movimiento anulado. Corrige los datos y confirma.");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "No se pudo corregir el movimiento.");
    }
  };

  const handleAnnul = async (codigoMovimiento: string) => {
    const motivo = await confirmWithReason("Anular venta", "Indica el motivo de la anulación.");
    if (!motivo) return;

    try {
      const response: any = await annulMovementService(codigoMovimiento, motivo);
      const success = getApiSuccess(response);
      const message = getApiMessage(response, "Venta anulada con éxito.");
      if (success === false) { toast.error(message); return; }
      toast.success(message);
      setInternalEditing(null);
      setIsCorrection(false);
      setOriginalCode(undefined);
      onClearEdit?.();
      await reloadMovements();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "No se pudo anular la venta.");
    }
  };

  const handleCancelEdit = () => {
    setInternalEditing(null);
    setIsCorrection(false);
    setOriginalCode(undefined);
    onClearEdit?.();
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ventas</h2>
          <p className="text-gray-500">Registra ventas con múltiples referencias y tallas.</p>
        </div>
        <button
          onClick={() => setShowTable(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium shadow-sm"
        >
          <ClipboardList size={16} />
          Ver historial
          {tableRows.length > 0 && (
            <span className="ml-1 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">
              {tableRows.length}
            </span>
          )}
        </button>
      </div>

      <SalesForm
        inventory={inventory}
        warehouses={warehouses}
        sizes={sizes}
        currentUserId={currentUserId}
        editingMovement={activeEditing}
        isCorrection={isCorrection}
        originalCode={originalCode}
        onSubmit={handleSubmitMovement}
        onCancelEdit={handleCancelEdit}
      />

      <MovimientosTableModal
        open={showTable}
        onClose={() => setShowTable(false)}
        rows={tableRows}
        filter="VENTA"
        onEdit={handleCorrect}
        onAnnul={handleAnnul}
        title="Ventas registradas"
        subtitle="Historial de ventas."
      />
    </div>
  );
}
