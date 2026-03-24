import React, { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";

import type {
  ReportChartRow,
  ReportFilters,
  ReportSummaryItem,
  ReportTotals,
} from "./Reportes.types";

import { ReportsFilters } from "./Componentes/ReportesFilter";
import { ReportsChart } from "./Componentes/ReportesChart";
import { exportSummaryReportToPdf } from "../Reportes/Componentes/reportesPdf";
import { getSummaryReport } from "../../services/reposrtes.service";

// ✅ servicios reales
import { listUsersService } from "../../services/usuarios.service";
import { warehouseService } from "../../services/bodegas.service";

const DEFAULT_FILTERS: ReportFilters = {
  dateFrom: "",
  warehouse: "ALL",
  userId: "ALL",
  movementType: "ALL",
};

type WarehouseOption = {
  code: string;
  name: string;
};

type UserOption = {
  id: string;
  name: string;
};

export function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_FILTERS);

  const [data, setData] = useState<ReportChartRow[]>([]);
  const [items, setItems] = useState<ReportSummaryItem[]>([]);
  const [totals, setTotals] = useState<ReportTotals>({
    registros: 0,
    cantidad: 0,
    valorEstimado: 0,
  });

  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([
    { code: "ALL", name: "Todas las Bodegas" },
  ]);

  const [users, setUsers] = useState<UserOption[]>([
    { id: "ALL", name: "Todos los Usuarios" },
  ]);

  const [loading, setLoading] = useState(false);
  const [loadingCatalogs, setLoadingCatalogs] = useState(false);

  const loadCatalogs = async () => {
    try {
      setLoadingCatalogs(true);

      const [usersRes, warehousesRes] = await Promise.all([
        listUsersService(),
        warehouseService.getAll(),
      ]);

      setUsers([
        { id: "ALL", name: "Todos los Usuarios" },
        ...usersRes.map((user: any) => ({
          id: String(user.identificacion),
          name: user.nombre_completo,
        })),
      ]);

      setWarehouses([
        { code: "ALL", name: "Todas las Bodegas" },
        ...warehousesRes.map((warehouse) => ({
          code: warehouse.code,
          name: warehouse.name,
        })),
      ]);
    } catch (error) {
      console.error("Error cargando usuarios y bodegas:", error);
      toast.error("No se pudieron cargar usuarios y bodegas");
    } finally {
      setLoadingCatalogs(false);
    }
  };

  const loadReport = async (currentFilters: ReportFilters) => {
    try {
      setLoading(true);

      const res = await getSummaryReport(currentFilters);

      setData(res.chartData);
      setItems(res.items);
      setTotals(res.totals);
    } catch (error) {
      console.error("Error cargando reporte:", error);
      toast.error("No se pudo cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCatalogs();
    loadReport(DEFAULT_FILTERS);
  }, []);

  const handleFilter = async () => {
    await loadReport(filters);
  };

  const handleExport = () => {
    if (!items.length) {
      toast.error("No hay datos para exportar");
      return;
    }

    exportSummaryReportToPdf({
      filters,
      chartData: data,
      totals,
      items,
    });

    toast.success("PDF generado correctamente");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Centro de Reportes
          </h2>
          <p className="text-gray-500">
            Analice el rendimiento y rotación de stock.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          <Download className="w-5 h-5" />
          Exportar PDF
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <ReportsFilters
          value={filters}
          onChange={setFilters}
          onSubmit={handleFilter}
          warehouses={warehouses}
          users={users}
        />

        {loadingCatalogs ? (
          <div className="py-8 text-sm text-gray-500">
            Cargando usuarios y bodegas...
          </div>
        ) : loading ? (
          <div className="py-8 text-sm text-gray-500">
            Cargando reporte...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-50 border">
                <p className="text-sm text-gray-500">Registros</p>
                <p className="text-2xl font-bold">{totals.registros}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border">
                <p className="text-sm text-gray-500">Cantidad total</p>
                <p className="text-2xl font-bold">{totals.cantidad}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border">
                <p className="text-sm text-gray-500">Valor estimado</p>
                <p className="text-2xl font-bold">
                  {new Intl.NumberFormat("es-CO", {
                    style: "currency",
                    currency: "COP",
                    maximumFractionDigits: 0,
                  }).format(totals.valorEstimado)}
                </p>
              </div>
            </div>

            <ReportsChart data={data} />
          </>
        )}
      </div>
    </div>
  );
}