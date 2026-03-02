export type ReportMovementType = "ALL" | "VENTAS" | "TRASPASOS";

export type ReportFilters = {
  dateFrom: string;      // yyyy-mm-dd
  warehouse: string;     // "ALL" o codigo_bodega
  userId: string;        // "ALL" o id_usuario
  movementType: ReportMovementType;
};

export type ReportChartRow = {
  name: string;
  ventas: number;
  traspasos: number;
};