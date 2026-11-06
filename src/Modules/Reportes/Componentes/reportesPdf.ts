import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { ReportChartRow, ReportFilters, ReportSummaryItem, ReportTotals } from "../Reportes.types";

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

const HEADER_COLOR: [number, number, number] = [30, 58, 138];

export function exportSummaryReportToPdf(params: {
  filters: ReportFilters;
  chartData: ReportChartRow[];
  totals: ReportTotals;
  items: ReportSummaryItem[];
  userMap?: Map<string, string>;
}) {
  const { filters, chartData, totals, items, userMap } = params;

  const doc = new jsPDF({ orientation: "landscape" });

  // Title
  doc.setFontSize(18);
  doc.setTextColor(30, 58, 138);
  doc.text("Reporte de Movimientos — Kardex 360", 14, 18);
  doc.setTextColor(0, 0, 0);

  // Applied filters
  doc.setFontSize(9);
  const fechaDesde = filters.dateFrom ? formatDate(filters.dateFrom) : "Todas";
  const fechaHasta = filters.dateTo   ? formatDate(filters.dateTo)   : "Todas";
  const bodega     = filters.warehouse === "ALL" ? "Todas" : filters.warehouse;
  const usuario    = filters.userId === "ALL"
    ? "Todos"
    : (userMap?.get(filters.userId) ?? filters.userId);
  const tipo       = filters.movementType === "ALL" ? "Todos" : filters.movementType;

  doc.text(`Período: ${fechaDesde} — ${fechaHasta}`, 14, 28);
  doc.text(`Bodega: ${bodega}   |   Responsable: ${usuario}   |   Tipo: ${tipo}`, 14, 34);
  doc.text(`Generado: ${new Date().toLocaleString("es-CO")}`, 14, 40);

  // KPI table
  autoTable(doc, {
    startY: 46,
    head: [["Indicador", "Valor"]],
    body: [
      ["Total registros",    totals.registros.toLocaleString("es-CO")],
      ["Unidades movidas",   totals.cantidad.toLocaleString("es-CO")],
      ["Valor estimado",     money(totals.valorEstimado)],
    ],
    headStyles: { fillColor: HEADER_COLOR },
    tableWidth: 90,
    styles: { fontSize: 9 },
  });

  // Chart data table
  if (chartData.length > 0) {
    autoTable(doc, {
      startY: (doc as any).lastAutoTable.finalY + 6,
      head: [["Día", "Ventas", "Entradas", "Traspasos"]],
      body: chartData.map((row) => [
        row.name,
        String(row.ventas),
        String(row.entradas),
        String(row.traspasos),
      ]),
      headStyles: { fillColor: HEADER_COLOR },
      styles: { fontSize: 8 },
    });
  }

  // Detail table
  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 6,
    head: [[
      "Código",
      "Tipo",
      "Fecha",
      "Bodega",
      "Referencia",
      "Descripción",
      "Talla",
      "Cant.",
      "Vr. Unitario",
      "Total",
      "Responsable",
    ]],
    body: items.map((item) => {
      const tipo = item.movimientos.tipo;
      const precio = Number(item.valor_unitario);

      let bodegaCell = "-";
      if (tipo === "VENTA")     bodegaCell = item.movimientos.bodega_origen ?? "-";
      else if (tipo === "TRASPASO") bodegaCell = `${item.movimientos.bodega_origen ?? "-"} → ${item.movimientos.bodega_destino ?? "-"}`;
      else                      bodegaCell = item.movimientos.bodega_destino ?? "-";

      return [
        item.movimientos.codigo_movimiento,
        tipo,
        formatDate(item.movimientos.fecha),
        bodegaCell,
        item.referencia,
        item.productos.descripcion,
        item.talla,
        String(item.cantidad),
        money(precio),
        money(item.cantidad * precio),
        item.movimientos.usuarios?.nombre_completo ?? item.movimientos.responsable,
      ];
    }),
    headStyles: { fillColor: HEADER_COLOR },
    styles: { fontSize: 7 },
    columnStyles: {
      7: { halign: "right" },
      8: { halign: "right" },
      9: { halign: "right" },
    },
  });

  doc.save(`reporte-movimientos-${new Date().toISOString().slice(0, 10)}.pdf`);
}
