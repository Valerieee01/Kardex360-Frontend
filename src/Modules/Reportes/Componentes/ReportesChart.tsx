import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Bar,
  Legend,
} from "recharts";

import type { ReportChartRow } from "../Reportes.types";

type Props = {
  data: ReportChartRow[];
};

export function ReportsChart({ data }: Props) {
  return (
    <div className="h-[400px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="#f1f5f9"
          />

          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
          />

          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: "#94a3b8" }}
          />

          <RechartsTooltip
            cursor={{ fill: "#f8fafc" }}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
            }}
          />

          <Legend />

          <Bar
            dataKey="ventas"
            name="Ventas"
            fill="#1e3a8a"
            radius={[4, 4, 0, 0]}
            barSize={24}
          />

          <Bar
            dataKey="traspasos"
            name="Traspasos"
            fill="#10b981"
            radius={[4, 4, 0, 0]}
            barSize={24}
          />

          <Bar
            dataKey="entradas"
            name="Entradas"
            fill="#f59e0b"
            radius={[4, 4, 0, 0]}
            barSize={24}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}