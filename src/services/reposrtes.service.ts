import { http } from "../app/Shared/http";
import type {
  ReportFilters,
  ReportChartRow,
  ReportSummaryResponse,
  UserMovementsResponse,
  ReportTotals,
} from "../Modules/Reportes/Reportes.types";

function mapMovementType(type: ReportFilters["movementType"]) {
  switch (type) {
    case "VENTAS":    return "VENTA";
    case "TRASPASOS": return "TRASPASO";
    case "ENTRADAS":  return "ENTRADA";
    default:          return undefined;
  }
}

export function buildReportQuery(filters: ReportFilters) {
  const params = new URLSearchParams();

  if (filters.dateFrom) params.append("fechaDesde", filters.dateFrom);
  if (filters.dateTo)   params.append("fechaHasta", filters.dateTo);

  if (filters.warehouse && filters.warehouse !== "ALL") {
    params.append("bodega", filters.warehouse);
  }

  if (filters.userId && filters.userId !== "ALL") {
    params.append("responsable", filters.userId);
  }

  const tipo = mapMovementType(filters.movementType);
  if (tipo) params.append("tipo", tipo);

  return params.toString();
}

export async function getSummaryReport(filters: ReportFilters) {
  const query = buildReportQuery(filters);
  const url = query
    ? `/reportes/movimientos/resumen?${query}`
    : `/reportes/movimientos/resumen`;

  const data = await http.get<ReportSummaryResponse>(url);

  const chartData: ReportChartRow[] = (data as any).data.chart.map((item: any) => ({
    name: item.dia,
    ventas: item.ventas,
    traspasos: item.traspasos,
    entradas: item.entradas,
  }));

  const totals: ReportTotals = {
    registros: (data as any).data.totales.registros,
    cantidad: (data as any).data.totales.cantidad,
    valorEstimado: (data as any).data.totales.valor_estimado,
  };

  return {
    raw: data,
    chartData,
    totals,
    items: (data as any).data.items,
  };
}

export async function getUserMovementsReport(
  identificacion: string,
  filters: ReportFilters
) {
  const params = new URLSearchParams();

  if (filters.dateFrom) params.append("fechaDesde", filters.dateFrom);
  if (filters.dateTo)   params.append("fechaHasta", filters.dateTo);

  if (filters.warehouse && filters.warehouse !== "ALL") {
    params.append("bodega", filters.warehouse);
  }

  const tipo = mapMovementType(filters.movementType);
  if (tipo) params.append("tipo", tipo);

  const query = params.toString();
  const url = query
    ? `/reportes/usuarios/${identificacion}/movimientos?${query}`
    : `/reportes/usuarios/${identificacion}/movimientos`;

  return http.get<UserMovementsResponse>(url);
}
