import { http } from "../app/Shared/http"

export type DashboardApiResponse = {
  success: boolean;
  message: string;
  data: {
    cards: {
      totalProductos: number;
      stockDisponible: number;
      ventasHoy: number;
      traspasosHoy: number;
    };
    ultimosMovimientos: Array<{
      producto: string;
      fecha: string;
      usuario: string;
      cantidad: number;
      tipo: "VENTA" | "TRASPASO" | "ENTRADA";
    }>;
    movimientosSemana: Array<{
      fecha: string;
      tipo: "VENTA" | "TRASPASO" | "ENTRADA";
    }>;
  };
};

export const dashboardService = {
  getDashboard: () => http.get<DashboardApiResponse>("/dashboard/resumen"),
};