import { useEffect, useState } from "react";
import { Download, FileBarChart2 } from "lucide-react";
import { toast } from "sonner";

import type {
  ReportChartRow,
  ReportFilters,
  ReportSummaryItem,
  ReportTotals,
} from "./Reportes.types";

import { ReportsFilters } from "./Componentes/ReportesFilter";
import { ReportsChart } from "./Componentes/ReportesChart";
import { exportSummaryReportToPdf } from "./Componentes/reportesPdf";
import { getSummaryReport } from "../../services/reposrtes.service";
import { listUsersService } from "../../services/usuarios.service";
import { warehouseService } from "../../services/bodegas.service";

const DEFAULT_FILTERS: ReportFilters = {
  dateFrom: "",
  dateTo: "",
  warehouse: "ALL",
  userId: "ALL",
  movementType: "ALL",
};

type WarehouseOption = { code: string; name: string };
type UserOption = { id: string; name: string };

const TIPO_LABEL: Record<string, string> = {
  VENTA: "Venta",
  ENTRADA: "Entrada",
  TRASPASO: "Traspaso",
};

const TIPO_CLASS: Record<string, string> = {
  VENTA: "bg-red-100 text-red-700",
  ENTRADA: "bg-emerald-100 text-emerald-700",
  TRASPASO: "bg-amber-100 text-amber-700",
};

function money(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("es-CO", { dateStyle: "short" });
}

export function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_FILTERS);

  const [chartData, setChartData] = useState<ReportChartRow[]>([]);
  const [items, setItems] = useState<ReportSummaryItem[]>([]);
  const [totals, setTotals] = useState<ReportTotals>({ registros: 0, cantidad: 0, valorEstimado: 0 });
  const [hasLoaded, setHasLoaded] = useState(false);

  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([{ code: "ALL", name: "Todas las bodegas" }]);
  const [users, setUsers] = useState<UserOption[]>([{ id: "ALL", name: "Todos los responsables" }]);
  const [userMap, setUserMap] = useState<Map<string, string>>(new Map());

  const [loading, setLoading] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(true);

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        const [usersRes, warehousesRes] = await Promise.all([
          listUsersService(),
          warehouseService.getAll(),
        ]);

        const activeWarehouses = warehousesRes.filter((w) => w.estado !== false);

        const map = new Map<string, string>();
        const userOpts: UserOption[] = usersRes.map((user: any) => {
          map.set(String(user.identificacion), user.nombre_completo);
          return { id: String(user.identificacion), name: user.nombre_completo };
        });

        setUserMap(map);
        setUsers([{ id: "ALL", name: "Todos los responsables" }, ...userOpts]);
        setWarehouses([
          { code: "ALL", name: "Todas las bodegas" },
          ...activeWarehouses.map((w) => ({ code: w.code!, name: w.name! })),
        ]);
      } catch {
        toast.error("No se pudieron cargar usuarios y bodegas");
      } finally {
        setLoadingCatalogs(false);
      }
    };

    loadCatalogs();
  }, []);

  const loadReport = async (currentFilters: ReportFilters) => {
    try {
      setLoading(true);
      const res = await getSummaryReport(currentFilters);
      setChartData(res.chartData);
      setItems(res.items);
      setTotals(res.totals);
      setHasLoaded(true);
    } catch {
      toast.error("No se pudo cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => loadReport(filters);

  const handleExport = () => {
    if (!items.length) { toast.error("No hay datos para exportar"); return; }
    exportSummaryReportToPdf({ filters, chartData, totals, items, userMap });
    toast.success("PDF generado correctamente");
  };

  const warehouseLabel = (bodega_origen: string | null, bodega_destino: string | null, tipo: string) => {
    if (tipo === "VENTA") return bodega_origen || "-";
    if (tipo === "TRASPASO") return `${bodega_origen || "-"} → ${bodega_destino || "-"}`;
    return bodega_destino || "-";
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Centro de Reportes</h2>
          <p className="text-gray-500">Analice el rendimiento y rotación de stock.</p>
        </div>
        <button
          onClick={handleExport}
          disabled={!hasLoaded || !items.length}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 text-sm font-medium shadow-sm"
        >
          <Download size={16} />
          Exportar PDF
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        {loadingCatalogs ? (
          <div className="py-4 text-sm text-gray-400">Cargando filtros...</div>
        ) : (
          <ReportsFilters
            value={filters}
            onChange={setFilters}
            onSubmit={handleFilter}
            warehouses={warehouses}
            users={users}
          />
        )}
      </div>

      {/* Results */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-400">
          Cargando reporte...
        </div>
      ) : !hasLoaded ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
          <FileBarChart2 size={40} className="mx-auto text-gray-200 mb-3" />
          <p className="text-gray-500 font-medium">Aplica los filtros y haz clic en <strong>Filtrar</strong> para ver el reporte.</p>
        </div>
      ) : (
        <>
          {/* KPI cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Registros</p>
              <p className="text-3xl font-bold text-gray-900">{totals.registros.toLocaleString("es-CO")}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Unidades movidas</p>
              <p className="text-3xl font-bold text-gray-900">{totals.cantidad.toLocaleString("es-CO")}</p>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-sm text-gray-500 mb-1">Valor estimado</p>
              <p className="text-3xl font-bold text-gray-900">{money(totals.valorEstimado)}</p>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Movimientos por día</h3>
              <ReportsChart data={chartData} />
            </div>
          )}

          {/* Detail table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/60 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-gray-900">Detalle de movimientos</h3>
                <p className="text-sm text-gray-500">{items.length} registro{items.length !== 1 ? "s" : ""}</p>
              </div>
            </div>

            {items.length === 0 ? (
              <div className="py-10 text-center text-gray-400">Sin registros para los filtros seleccionados.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm min-w-[900px]">
                  <thead className="bg-gray-50/50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Código</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Tipo</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Fecha</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Bodega</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Referencia</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Descripción</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Talla</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Cant.</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Vr. Unitario</th>
                      <th className="px-4 py-3 text-right text-xs font-bold text-gray-500 uppercase tracking-wide">Total</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wide">Responsable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {items.map((item, i) => {
                      const tipo = item.movimientos.tipo;
                      const precio = Number(item.valor_unitario);
                      return (
                        <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3 font-medium text-gray-900 text-xs">{item.movimientos.codigo_movimiento}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${TIPO_CLASS[tipo] ?? "bg-gray-100 text-gray-600"}`}>
                              {TIPO_LABEL[tipo] ?? tipo}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{formatDate(item.movimientos.fecha)}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">
                            {warehouseLabel(item.movimientos.bodega_origen, item.movimientos.bodega_destino, tipo)}
                          </td>
                          <td className="px-4 py-3 font-semibold text-gray-800">{item.referencia}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{item.productos.descripcion}</td>
                          <td className="px-4 py-3 text-gray-600">{item.talla}</td>
                          <td className="px-4 py-3 text-right font-medium text-gray-800">{item.cantidad}</td>
                          <td className="px-4 py-3 text-right text-gray-600 text-xs">{money(precio)}</td>
                          <td className="px-4 py-3 text-right font-bold text-gray-900 text-xs">{money(item.cantidad * precio)}</td>
                          <td className="px-4 py-3 text-gray-600 text-xs">{item.movimientos.usuarios?.nombre_completo ?? item.movimientos.responsable}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
