import { useEffect, useMemo, useState } from "react";
import {
  Package,
  Warehouse,
  ShoppingCart,
  ArrowLeftRight,
  Plus,
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
} from "recharts";

import {
  dashboardService,
  type DashboardApiResponse,
} from "../../services/dashboard.service";

const StatCard = ({
  label,
  value,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  icon: any;
  color: string;
}) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

type DashboardViewModel = {
  cards: {
    totalProductos: number;
    stockDisponible: number;
    ventasHoy: number;
    traspasosHoy: number;
  };
  recentMovements: Array<{
    id: string;
    type: "venta" | "traspaso" | "entrada";
    product: string;
    date: string;
    user: string;
    qty: number;
  }>;
  chartData: Array<{
    name: string;
    ventas: number;
    traspasos: number;
  }>;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
  }).format(value);
}

function formatMovementDate(value: string) {
  const date = new Date(value);

  return new Intl.DateTimeFormat("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function mapTipo(tipo: "VENTA" | "TRASPASO" | "ENTRADA"): "venta" | "traspaso" | "entrada" {
  if (tipo === "VENTA") return "venta";
  if (tipo === "TRASPASO") return "traspaso";
  return "entrada";
}

function getMovementIcon(type: "venta" | "traspaso" | "entrada") {
  if (type === "venta") return <ShoppingCart className="w-4 h-4" />;
  if (type === "traspaso") return <ArrowLeftRight className="w-4 h-4" />;
  return <Plus className="w-4 h-4" />;
}

function getMovementStyles(type: "venta" | "traspaso" | "entrada") {
  if (type === "venta") return "bg-blue-50 text-blue-600";
  if (type === "traspaso") return "bg-orange-50 text-orange-600";
  return "bg-emerald-50 text-emerald-600";
}

function buildWeeklyChart(
  movimientosSemana: DashboardApiResponse["data"]["movimientosSemana"]
) {
  const dias = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];

  const base = dias.map((name) => ({
    name,
    ventas: 0,
    traspasos: 0,
  }));

  movimientosSemana.forEach((mov) => {
    const fecha = new Date(mov.fecha);
    const day = fecha.getDay(); // 0 domingo, 1 lunes ... 6 sábado

    const indexMap: Record<number, number> = {
      1: 0, // lun
      2: 1, // mar
      3: 2, // mie
      4: 3, // jue
      5: 4, // vie
      6: 5, // sab
      0: 6, // dom
    };

    const index = indexMap[day];
    if (index === undefined) return;

    if (mov.tipo === "VENTA") {
      base[index].ventas += 1;
    }

    if (mov.tipo === "TRASPASO") {
      base[index].traspasos += 1;
    }
  });

  return base;
}

function mapDashboardData(api: DashboardApiResponse): DashboardViewModel {
  return {
    cards: {
      totalProductos: api.data.cards.totalProductos,
      stockDisponible: api.data.cards.stockDisponible,
      ventasHoy: api.data.cards.ventasHoy,
      traspasosHoy: api.data.cards.traspasosHoy,
    },
    recentMovements: api.data.ultimosMovimientos.map((mv, index) => ({
      id: `${mv.fecha}-${mv.producto}-${index}`,
      type: mapTipo(mv.tipo),
      product: mv.producto,
      date: formatMovementDate(mv.fecha),
      user: mv.usuario,
      qty: mv.cantidad,
    })),
    chartData: buildWeeklyChart(api.data.movimientosSemana),
  };
}

export default function DashboardPage() {
  const [rawData, setRawData] = useState<DashboardApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const dashboard = useMemo(() => {
    if (!rawData) return null;
    return mapDashboardData(rawData);
  }, [rawData]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await dashboardService.getDashboard();
      setRawData(response);
    } catch (err: any) {
      setError(err?.message || "No se pudo cargar el dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          Cargando dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl border border-red-100 shadow-sm">
          <p className="text-red-600 font-medium">{error}</p>
          <button
            onClick={loadDashboard}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-900 text-white"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          No hay datos para mostrar.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Resumen general de operaciones del día.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          label="Total Productos"
          value={dashboard.cards.totalProductos}
          icon={Package}
          color="bg-blue-900"
        />
        <StatCard
          label="Stock Disponible"
          value={dashboard.cards.stockDisponible}
          icon={Warehouse}
          color="bg-emerald-500"
        />
        <StatCard
          label="Ventas del Día"
          value={formatCurrency(dashboard.cards.ventasHoy)}
          icon={ShoppingCart}
          color="bg-indigo-600"
        />
        <StatCard
          label="Traspasos Hoy"
          value={dashboard.cards.traspasosHoy}
          icon={ArrowLeftRight}
          color="bg-orange-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Movimientos Semanales</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-3 h-3 bg-blue-900 rounded-full"></span> Ventas
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Traspasos
              </div>
            </div>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dashboard.chartData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTraspasos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />

                <RechartsTooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="ventas"
                  stroke="#1e3a8a"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorVentas)"
                />
                <Area
                  type="monotone"
                  dataKey="traspasos"
                  stroke="#10b981"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTraspasos)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Últimos Movimientos</h3>

          <div className="space-y-6">
            {dashboard.recentMovements.map((mv) => (
              <div key={mv.id} className="flex items-start gap-4">
                <div className={`mt-1 p-2 rounded-lg ${getMovementStyles(mv.type)}`}>
                  {getMovementIcon(mv.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{mv.product}</p>
                  <p className="text-xs text-gray-500">
                    {mv.date} • {mv.user}
                  </p>
                </div>

                <div className="text-sm font-bold text-gray-900">
                  {mv.type === "venta" ? "-" : "+"}
                  {mv.qty}
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-6 py-2.5 text-sm font-semibold text-blue-900 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
            Ver todos los movimientos
          </button>
        </div>
      </div>
    </div>
  );
}