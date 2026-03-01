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

// ✅ TU StatCard tal cual (inline)
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

// ✅ Datos de ejemplo (luego conectas backend)
const CHART_DATA = [
  { name: "Lun", ventas: 14, traspasos: 10 },
  { name: "Mar", ventas: 18, traspasos: 12 },
  { name: "Mié", ventas: 12, traspasos: 16 },
  { name: "Jue", ventas: 20, traspasos: 9 },
  { name: "Vie", ventas: 25, traspasos: 14 },
  { name: "Sáb", ventas: 16, traspasos: 8 },
  { name: "Dom", ventas: 10, traspasos: 6 },
];

const RECENT_MOVEMENTS = [
  { id: 1, type: "venta", product: "Camiseta Oversize", date: "Hoy 09:30", user: "valerie", qty: 2 },
  { id: 2, type: "traspaso", product: "Jean Skinny", date: "Ayer 18:10", user: "valerie", qty: 10 },
  { id: 3, type: "entrada", product: "Chaqueta Denim", date: "Ayer 15:40", user: "valerie", qty: 15 },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500">Resumen general de operaciones del día.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Productos" value="1,284" icon={Package} color="bg-blue-900" />
        <StatCard label="Stock Disponible" value="45,200" icon={Warehouse} color="bg-emerald-500" />
        <StatCard label="Ventas del Día" value="$2,450.00" icon={ShoppingCart} color="bg-indigo-600" />
        <StatCard label="Traspasos Hoy" value="12" icon={ArrowLeftRight} color="bg-orange-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart */}
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
              <AreaChart data={CHART_DATA}>
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
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94a3b8" }} />

                <RechartsTooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                  }}
                />

                <Area type="monotone" dataKey="ventas" stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
                <Area type="monotone" dataKey="traspasos" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTraspasos)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent movements */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <h3 className="font-bold text-gray-900 mb-6">Últimos Movimientos</h3>

          <div className="space-y-6">
            {RECENT_MOVEMENTS.map((mv) => (
              <div key={mv.id} className="flex items-start gap-4">
                <div
                  className={`mt-1 p-2 rounded-lg ${
                    mv.type === "venta"
                      ? "bg-blue-50 text-blue-600"
                      : mv.type === "traspaso"
                      ? "bg-orange-50 text-orange-600"
                      : "bg-emerald-50 text-emerald-600"
                  }`}
                >
                  {mv.type === "venta" ? (
                    <ShoppingCart className="w-4 h-4" />
                  ) : mv.type === "traspaso" ? (
                    <ArrowLeftRight className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
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