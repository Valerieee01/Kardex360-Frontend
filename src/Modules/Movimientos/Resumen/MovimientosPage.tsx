import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { RecentSalesTable } from "../Ventas/Componentes/VentasRecientesTables";
import type { MovementApiItem, SaleRow } from "../Ventas/ventas.types";
import type { ModuleKey } from "../../../layout/layout.types";
import {
  annulMovementService,
  listMovementsService,
  listProductsForMovementService,
} from "../../../services/movimientos.service";
import { normalizeMovementRows, getApiSuccess, getApiMessage, buildMovementCode } from "../movimientos.utils";
import { confirmWithReason } from "../../../app/Shared/alerts";

type Props = {
  onNavigate: (module: ModuleKey, movement?: MovementApiItem) => void;
};

type FilterType = "TODOS" | "VENTA" | "ENTRADA" | "TRASPASO";

const moduleByType: Record<"VENTA" | "ENTRADA" | "TRASPASO", ModuleKey> = {
  VENTA: "sales",
  ENTRADA: "entries",
  TRASPASO: "transfers",
};

export function MovimientosPage({ onNavigate }: Props) {
  const [allMovements, setAllMovements] = useState<MovementApiItem[]>([]);
  const [tableRows, setTableRows] = useState<SaleRow[]>([]);
  const [filter, setFilter] = useState<FilterType>("TODOS");
  const [loading, setLoading] = useState(true);
  const inventoryMapRef = useRef<Map<string, { imagen_url: string; desc: string }>>(new Map());

  const loadMovements = async (tipo?: FilterType) => {
    try {
      const tipoParam = tipo && tipo !== "TODOS" ? tipo : undefined;
      const data = await listMovementsService(tipoParam);
      setAllMovements(data);
      setTableRows(normalizeMovementRows(data, inventoryMapRef.current));
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "No se pudieron cargar los movimientos.");
    }
  };

  const loadInitial = async () => {
    try {
      setLoading(true);
      const productsData = await listProductsForMovementService();
      inventoryMapRef.current = new Map(productsData.map((p) => [p.ref, { imagen_url: p.imagen_url ?? "", desc: p.desc ?? "" }]));
      await loadMovements();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadInitial(); }, []);

  useEffect(() => {
    loadMovements(filter);
  }, [filter]);

  const handleCorrect = async (codigoMovimiento: string) => {
    const mov = allMovements.find((m) => m.codigo_movimiento === codigoMovimiento);
    if (!mov) { toast.error("Movimiento no encontrado."); return; }

    const motivo = await confirmWithReason(
      "Corregir movimiento",
      "Se anulará el movimiento original y se abrirá el formulario pre-llenado para corregirlo.",
      "Ej: Bodega incorrecta..."
    );
    if (!motivo) return;

    try {
      const annulRes: any = await annulMovementService(codigoMovimiento, motivo);
      if (getApiSuccess(annulRes) === false) {
        toast.error(getApiMessage(annulRes, "No se pudo anular el movimiento."));
        return;
      }

      const target = moduleByType[mov.tipo];
      if (!target) { toast.error("Tipo de movimiento desconocido."); return; }

      toast.info("Movimiento anulado. Serás redirigido al formulario de corrección.");
      onNavigate(target, { ...mov, codigo_movimiento: buildMovementCode(mov.tipo) });
      await loadMovements(filter);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "No se pudo corregir el movimiento.");
    }
  };

  const handleAnnul = async (codigoMovimiento: string) => {
    const motivo = await confirmWithReason("Anular movimiento", "Indica el motivo de la anulación.");
    if (!motivo) return;

    try {
      const response: any = await annulMovementService(codigoMovimiento, motivo.trim());
      const success = getApiSuccess(response);
      const message = getApiMessage(response, "Movimiento anulado con éxito.");
      if (success === false) { toast.error(message); return; }
      toast.success(message);
      await loadMovements(filter);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || error?.message || "No se pudo anular el movimiento.");
    }
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Resumen de Movimientos</h2>
        <p className="text-gray-500">
          Todos los movimientos registrados — ventas, entradas y traspasos.
        </p>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
          Cargando movimientos...
        </div>
      ) : (
        <RecentSalesTable
          rows={tableRows}
          filter={filter}
          onChangeFilter={setFilter}
          onEdit={handleCorrect}
          onAnnul={handleAnnul}
          title="Todos los movimientos"
          subtitle="Ventas, entradas y traspasos. Haz clic en Corregir para anular y recrear el movimiento con los datos correctos."
        />
      )}
    </div>
  );
}
