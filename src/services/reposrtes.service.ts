import axios from "axios";
import type {
  ReportFilters,
  ReportChartRow,
  ReportSummaryResponse,
  UserMovementsResponse,
  ReportTotals,
  ReportSummaryItem,
} from "../Modules/Reportes/Reportes.types";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

function mapMovementType(type: ReportFilters["movementType"]) {
  switch (type) {
    case "VENTAS":
      return "VENTA";
    case "TRASPASOS":
      return "TRASPASO";
    case "ENTRADAS":
      return "ENTRADA";
    default:
      return "TODOS";
  }
}

function mapWarehouse(warehouse: string) {
  return warehouse === "ALL" ? "TODAS" : warehouse;
}

export function buildReportQuery(filters: ReportFilters) {
  const params = new URLSearchParams();

  if (filters.dateFrom) params.append("fechaDesde", filters.dateFrom);
  if (filters.warehouse && filters.warehouse !== "ALL") {
    params.append("bodega", mapWarehouse(filters.warehouse));
  }
  if (filters.movementType && filters.movementType !== "ALL") {
    params.append("tipo", mapMovementType(filters.movementType));
  }

  return params.toString();
}

export async function getSummaryReport(filters: ReportFilters) {
  const query = buildReportQuery(filters);
  const url = query
    ? `/reportes/movimientos/resumen?${query}`
    : `/reportes/movimientos/resumen`;

  const { data } = await api.get<ReportSummaryResponse>(url);

  const chartData: ReportChartRow[] = data.data.chart.map((item) => ({
    name: item.dia,
    ventas: item.ventas,
    traspasos: item.traspasos,
    entradas: item.entradas,
  }));

  const totals: ReportTotals = {
    registros: data.data.totales.registros,
    cantidad: data.data.totales.cantidad,
    valorEstimado: data.data.totales.valor_estimado,
  };

  return {
    raw: data,
    chartData,
    totals,
    items: data.data.items,
  };
}

export async function getUserMovementsReport(
  identificacion: string,
  filters: ReportFilters
) {
  const params = new URLSearchParams();

  if (filters.warehouse && filters.warehouse !== "ALL") {
    params.append("bodega", mapWarehouse(filters.warehouse));
  }

  if (filters.movementType && filters.movementType !== "ALL") {
    params.append("tipo", mapMovementType(filters.movementType));
  }

  if (filters.dateFrom) {
    params.append("fechaDesde", filters.dateFrom);
  }

  const query = params.toString();

  const url = query
    ? `/reportes/usuarios/${identificacion}/movimientos?${query}`
    : `/reportes/usuarios/${identificacion}/movimientos`;

  const { data } = await api.get<UserMovementsResponse>(url);
  return data;
}