export type ReportMovementType = "ALL" | "VENTAS" | "TRASPASOS" | "ENTRADAS";

export type ReportFilters = {
  dateFrom: string;
  warehouse: string;
  userId: string;
  movementType: ReportMovementType;
};

export type ReportChartRow = {
  name: string;
  ventas: number;
  traspasos: number;
  entradas: number;
};

export type ReportSummaryItem = {
  cantidad: number;
  valor_unitario: string | number;
  referencia: string;
  talla: string;
  created_at: string;
  productos: {
    referencia: string;
    descripcion: string;
  };
  movimientos: {
    codigo_movimiento: string;
    tipo: "ENTRADA" | "VENTA" | "TRASPASO";
    fecha: string;
    responsable: string;
    bodega_origen: string | null;
    bodega_destino: string | null;
    usuarios: {
      identificacion: string;
      nombre_completo: string;
    };
  };
};

export type ReportSummaryResponse = {
  success: boolean;
  data: {
    filtros: {
      bodega: string;
      tipo: string;
    };
    chart: Array<{
      dia: string;
      ventas: number;
      traspasos: number;
      entradas: number;
    }>;
    totales: {
      registros: number;
      cantidad: number;
      valor_estimado: number;
    };
    items: ReportSummaryItem[];
  };
};

export type UserMovementsResponse = {
  success: boolean;
  data: {
    identificacion: string;
    filtros: {
      bodega: string;
      tipo: string;
    };
    data: Array<{
      codigo_movimiento: string;
      tipo: string;
      fecha: string;
      bodega_origen: string | null;
      bodega_destino: string | null;
      producto: string;
      referencia: string;
      cantidad: number;
      valor_unitario: number;
      total_linea: number;
    }>;
  };
};

export type ReportTotals = {
  registros: number;
  cantidad: number;
  valorEstimado: number;
};