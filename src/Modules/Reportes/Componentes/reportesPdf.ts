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
  return new Date(value).toLocaleDateString("es-CO");
}

export function exportSummaryReportToPdf(params: {
  filters: ReportFilters;
  chartData: ReportChartRow[];
  totals: ReportTotals;
  items: ReportSummaryItem[];
}) {
  const { filters, chartData, totals, items } = params;

  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Reporte de Movimientos", 14, 18);

  doc.setFontSize(10);
  doc.text(`Fecha desde: ${filters.dateFrom || "Todas"}`, 14, 28);
  doc.text(`Bodega: ${filters.warehouse === "ALL" ? "Todas" : filters.warehouse}`, 14, 34);
  doc.text(`Usuario: ${filters.userId === "ALL" ? "Todos" : filters.userId}`, 14, 40);
  doc.text(`Tipo: ${filters.movementType === "ALL" ? "Todos" : filters.movementType}`, 14, 46);

  autoTable(doc, {
    startY: 54,
    head: [["Indicador", "Valor"]],
    body: [
      ["Total registros", String(totals.registros)],
      ["Total cantidad", String(totals.cantidad)],
      ["Valor estimado", money(totals.valorEstimado)],
    ],
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 8,
    head: [["Día", "Ventas", "Traspasos", "Entradas"]],
    body: chartData.map((row) => [
      row.name,
      String(row.ventas),
      String(row.traspasos),
      String(row.entradas),
    ]),
  });

  autoTable(doc, {
    startY: (doc as any).lastAutoTable.finalY + 8,
    head: [[
      "Código",
      "Tipo",
      "Fecha",
      "Producto",
      "Referencia",
      "Talla",
      "Cantidad",
      "Vr. Unitario",
      "Responsable",
    ]],
    body: items.map((item) => [
      item.movimientos.codigo_movimiento,
      item.movimientos.tipo,
      formatDate(item.movimientos.fecha),
      item.productos.descripcion,
      item.referencia,
      item.talla,
      String(item.cantidad),
      money(Number(item.valor_unitario)),
      item.movimientos.usuarios.nombre_completo,
    ]),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [30, 58, 138] },
  });

  doc.save("reporte-movimientos.pdf");
}