import { useEffect, useMemo, useState } from "react";
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

function mapMovementsToRows(items: MovementApiItem[]): SaleRow[] {
  return items.flatMap((mov, movIndex) => {
    const detalles = Array.isArray(mov.movimiento_detalle) ? mov.movimiento_detalle : [];

    if (detalles.length === 0) {
      return [
        {
          id: `${mov.codigo_movimiento}-${movIndex}`,
          codigo_movimiento: mov.codigo_movimiento,
          tipo: mov.tipo,
          responsable: mov.responsable,
          ref: "-",
          qty: 0,
          price: 0,
          total: 0,
          warehouse:
            mov.tipo === "VENTA"
              ? mov.bodega_origen || "-"
              : mov.bodega_destino || mov.bodega_origen || "-",
          date: formatDate(mov.created_at || mov.fecha || mov.updated_at),
          estado:
            mov.estado === true
              ? "ACTIVO"
              : mov.estado === false
              ? "ANULADO"
              : String(mov.estado ?? "ACTIVO"),
          observacion: mov.observacion,
        },
      ];
    }

    return detalles.map((d, index) => ({
      id: `${mov.codigo_movimiento}-${d.referencia}-${index}`,
      codigo_movimiento: mov.codigo_movimiento,
      tipo: mov.tipo,
      responsable: mov.responsable,
      ref: d.referencia || "-",
      qty: Number(d.cantidad ?? 0),
      price: Number(d.valor_unitario ?? 0),
      total: Number(d.cantidad ?? 0) * Number(d.valor_unitario ?? 0),
      warehouse:
        mov.tipo === "VENTA"
          ? mov.bodega_origen || "-"
          : mov.bodega_destino || mov.bodega_origen || "-",
      date: formatDate(mov.created_at || mov.fecha || mov.updated_at),
      estado:
        mov.estado === true
          ? "ACTIVO"
          : mov.estado === false
          ? "ANULADO"
          : String(mov.estado ?? "ACTIVO"),
      observacion: mov.observacion,
    }));
  });
}

export function SalesPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [sizes, setSizes] = useState<SizeItem[]>([]);
  const [movements, setMovements] = useState<MovementApiItem[]>([]);
  const [filter, setFilter] = useState<"TODOS" | "VENTA" | "ENTRADA" | "TRASPASO">("TODOS");
  const [loading, setLoading] = useState(true);
  const [editingMovement, setEditingMovement] = useState<MovementApiItem | null>(null);

  const currentUserId = getCurrentUserId();

  const loadInitialData = async () => {
    try {
      setLoading(true);

      const [productsData, warehousesData, sizesData, movementsData] = await Promise.all([
        listProductsForMovementService(),
        listWarehousesForMovementService(),
        sizesService.list(),
        listMovementsService(),
      ]);

      setInventory(productsData);
      setWarehouses(warehousesData);
      setSizes(sizesData);
      setMovements(movementsData);
    } catch (error: any) {
      console.error("ERROR CARGANDO MOVIMIENTOS:", error);
      toast.error(error?.response?.data?.message || "No se pudieron cargar los movimientos.");
    } finally {
      setLoading(false);
    }
  };

  const reloadMovements = async (
    selectedFilter?: "TODOS" | "VENTA" | "ENTRADA" | "TRASPASO"
  ) => {
    try {
      const tipo = selectedFilter && selectedFilter !== "TODOS" ? selectedFilter : undefined;
      const data = await listMovementsService(tipo);
      console.log("MOVIMIENTOS BACKEND:", data);
      setMovements(data);
    } catch (error: any) {
      console.error("ERROR RECARGANDO MOVIMIENTOS:", error);
      toast.error(error?.response?.data?.message || "No se pudo actualizar el listado.");
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    reloadMovements(filter);
  }, [filter]);

  const tableRows = useMemo(() => {
    const rows = mapMovementsToRows(movements);
    console.log("ROWS TABLA:", rows);
    return rows;
  }, [movements]);

  const handleSubmitMovement = async (
    payload: CreateMovementPayload,
    editingCode?: string
  ) => {
    try {
      if (editingCode) {
        await updateMovementService(editingCode, payload);
        toast.success("Movimiento actualizado con éxito.");
        setEditingMovement(null);
      } else {
        await createMovementService(payload);
        toast.success(
          payload.tipo === "VENTA"
            ? "Venta registrada con éxito."
            : "Entrada registrada con éxito."
        );
      }

      await reloadMovements(filter);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "No se pudo guardar el movimiento.");
      throw error;
    }
  };

  const handleEdit = (codigoMovimiento: string) => {
    const found = movements.find((m) => m.codigo_movimiento === codigoMovimiento);
    if (!found) {
      toast.error("No se encontró el movimiento para editar.");
      return;
    }

    setEditingMovement(found);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnnul = async (codigoMovimiento: string) => {
    const motivo = window.prompt("Escribe el motivo de anulación:");

    if (!motivo || !motivo.trim()) {
      toast.error("Debes ingresar un motivo para anular el movimiento.");
      return;
    }

    try {
      await annulMovementService(codigoMovimiento, motivo.trim());
      toast.success("Movimiento anulado con éxito.");

      if (editingMovement?.codigo_movimiento === codigoMovimiento) {
        setEditingMovement(null);
      }

      await reloadMovements(filter);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "No se pudo anular el movimiento.");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-7xl mx-auto">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Movimientos de Inventario</h2>
          <p className="text-gray-500">
            Registra ventas o entradas con múltiples productos en un solo movimiento.
          </p>
        </div>

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

      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Historial de movimientos</h2>
          <p className="text-gray-500">
            Consulta, filtra, edita o anula movimientos registrados.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
            Cargando información...
          </div>
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