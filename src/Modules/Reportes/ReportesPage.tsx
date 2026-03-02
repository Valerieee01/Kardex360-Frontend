import React, { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import type { ReportChartRow, ReportFilters } from "./Reportes.types";
import { ReportsFilters } from "./Componentes/ReportesFilter";
import { ReportsChart } from "./Componentes/ReportesChart";

const CHART_DATA: ReportChartRow[] = [
  { name: "Ene", ventas: 12, traspasos: 6 },
  { name: "Feb", ventas: 18, traspasos: 4 },
  { name: "Mar", ventas: 9, traspasos: 8 },
  { name: "Abr", ventas: 22, traspasos: 3 },
];

const DEFAULT_FILTERS: ReportFilters = {
  dateFrom: "",
  warehouse: "ALL",
  userId: "ALL",        // ✅ nuevo
  movementType: "ALL",
};

export function ReportsPage() {
  const [filters, setFilters] = useState<ReportFilters>(DEFAULT_FILTERS);
  const [data, setData] = useState<ReportChartRow[]>(CHART_DATA);

  const handleFilter = () => {
    // ✅ Luego: llamas backend con filters (incluye userId y warehouse)
    toast("Filtro aplicado (mock)");
    console.log("filters:", filters);
    setData(CHART_DATA);
  };

  const handleExport = () => {
    toast("Exportar a Excel (pendiente)");
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Centro de Reportes</h2>
          <p className="text-gray-500">Analice el rendimiento y rotación de stock.</p>
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-all"
        >
          <Download className="w-5 h-5" /> Exportar a Excel
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <ReportsFilters
          value={filters}
          onChange={setFilters}
          onSubmit={handleFilter}
          warehouses={[
            { code: "ALL", name: "Todas las Bodegas" },
            { code: "BOD-01", name: "Principal" },
            { code: "BOD-02", name: "Sucursal Centro" },
          ]}
          users={[
            { id: "ALL", name: "Todos los Usuarios" },
            { id: "USR-001", name: "Juan Pérez" },
            { id: "USR-002", name: "María Gómez" },
          ]}
        />

        <ReportsChart data={data} />
      </div>
    </div>
  );
}