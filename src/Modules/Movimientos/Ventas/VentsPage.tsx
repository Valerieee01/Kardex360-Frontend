import { useEffect, useState } from "react";
import { toast } from "sonner";
import { SalesForm } from "./Componentes/VentasFrm";
import { RecentSalesTable } from "./Componentes/VentasRecientesTables";
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
  updateMovementService,
} from "../../../services/movimientos.service";
import { sizesService } from "../../../services/sizes.service";
import { getCurrentUserId } from "../../../app/Shared/auth";

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getApiSuccess(response: any): boolean | undefined {
  return response?.success ?? response?.data?.success;
}

function getApiMessage(response: any, fallback: string): string {
  return response?.message ?? response?.data?.message ?? fallback;
}

function normalizeMovementRows(items: MovementApiItem[]): SaleRow[] {
  const rows: SaleRow[] = [];

  for (const mov of items) {
    const detalles = Array.isArray(mov.movimiento_detalle)
      ? mov.movimiento_detalle
      : [];

    const estadoTexto =
      mov.estado === true
        ? "ACTIVO"
        : mov.estado === false
        ? "ANULADO"
        : String(mov.estado ?? "ACTIVO");

    const warehouse =
      mov.tipo === "VENTA"
        ? mov.bodega_origen || "-"
        : mov.bodega_destino || mov.bodega_origen || "-";

    if (detalles.length === 0) {
      rows.push({
        id: `${mov.codigo_movimiento}-0`,
        codigo_movimiento: mov.codigo_movimiento,
        tipo: mov.tipo,
        responsable: mov.responsable,
        ref: "-",
        qty: 0,
        price: 0,
        total: 0,
        warehouse,
        date: formatDate(mov.fecha || mov.created_at || mov.updated_at),
        estado: estadoTexto,
        observacion: mov.observacion,
      });
      continue;
    }

    for (let index = 0; index < detalles.length; index++) {
      const d = detalles[index];
      const qty = Number(d.cantidad ?? 0);
      const price = Number(d.valor_unitario ?? 0);

      rows.push({
        id: `${mov.codigo_movimiento}-${d.item ?? index}`,
        codigo_movimiento: mov.codigo_movimiento,
        tipo: mov.tipo,
        responsable: mov.responsable,
        ref: d.referencia || "-",
        qty,
        price,
        total: qty * price,
        warehouse,
        date: formatDate(mov.fecha || mov.created_at || mov.updated_at),
        estado: estadoTexto,
        observacion: mov.observacion,
      });
    }
  }

  return rows;
}

export function SalesPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [sizes, setSizes] = useState<SizeItem[]>([]);
  const [movements, setMovements] = useState<MovementApiItem[]>([]);
  const [tableRows, setTableRows] = useState<SaleRow[]>([]);
  const [filter, setFilter] = useState<"TODOS" | "VENTA" | "ENTRADA" | "TRASPASO">("TODOS");
  const [loading, setLoading] = useState(true);
  const [editingMovement, setEditingMovement] = useState<MovementApiItem | null>(null);

  const currentUserId = getCurrentUserId();

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [productsData, warehousesData, sizesData, movementsData] =
        await Promise.all([
          listProductsForMovementService(),
          listWarehousesForMovementService(),
          sizesService.list(),
          listMovementsService(),
        ]);

      const normalized = normalizeMovementRows(movementsData);

      setInventory(productsData);
      setWarehouses(warehousesData);
      setSizes(sizesData);
      setMovements(movementsData);
      setTableRows(normalized);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "No se pudieron cargar los movimientos."
      );
    } finally {
      setLoading(false);
    }
  };

  const reloadMovements = async (
    selectedFilter?: "TODOS" | "VENTA" | "ENTRADA" | "TRASPASO"
  ) => {
    try {
      const tipo =
        selectedFilter && selectedFilter !== "TODOS"
          ? selectedFilter
          : undefined;

      const data = await listMovementsService(tipo);
      const normalized = normalizeMovementRows(data);

      setMovements(data);
      setTableRows(normalized);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "No se pudo actualizar el listado."
      );
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    reloadMovements(filter);
  }, [filter]);

  const handleSubmitMovement = async (
    payload: CreateMovementPayload,
    editingCode?: string
  ) => {
    try {
      let response: any;

      if (editingCode) {
        response = await updateMovementService(editingCode, payload);
      } else {
        response = await createMovementService(payload);
      }

      const success = getApiSuccess(response);
      const message = getApiMessage(
        response,
        editingCode
          ? "Movimiento actualizado con éxito."
          : payload.tipo === "VENTA"
          ? "Venta registrada con éxito."
          : "Entrada registrada con éxito."
      );

      if (success === false) {
        toast.error(message);
        return;
      }

      toast.success(message);
      setEditingMovement(null);
      await reloadMovements(filter);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "No se pudo guardar el movimiento."
      );
      throw error;
    }
  };

  const handleEdit = (codigoMovimiento: string) => {
    const found = movements.find((m) => m.codigo_movimiento === codigoMovimiento);

    if (!found) {
      toast.error("No se encontró el movimiento.");
      return;
    }

    setEditingMovement(found);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnnul = async (codigoMovimiento: string) => {
    const motivo = window.prompt("Motivo de anulación:");

    if (!motivo || !motivo.trim()) {
      toast.error("Debes ingresar un motivo.");
      return;
    }

    try {
      const response: any = await annulMovementService(
        codigoMovimiento,
        motivo.trim()
      );

      const success = getApiSuccess(response);
      const message = getApiMessage(response, "Movimiento anulado con éxito.");

      if (success === false) {
        toast.error(message);
        return;
      }

      toast.success(message);
      setEditingMovement(null);
      await reloadMovements(filter);
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "No se pudo anular el movimiento."
      );
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="space-y-6">
        <SalesForm
          inventory={inventory}
          warehouses={warehouses}
          sizes={sizes}
          currentUserId={currentUserId}
          editingMovement={editingMovement}
          onSubmit={handleSubmitMovement}
          onCancelEdit={() => setEditingMovement(null)}
        />
      </div>

      <div>
        {loading ? (
          <div className="p-6 text-center">Cargando...</div>
        ) : (
          <RecentSalesTable
            rows={tableRows}
            filter={filter}
            onChangeFilter={setFilter}
            onEdit={handleEdit}
            onAnnul={handleAnnul}
          />
        )}
      </div>
    </div>
  );
}