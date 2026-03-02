import { MoreVertical, Warehouse } from "lucide-react";
import type { WarehouseItem } from "../BodegasTypes";

type Props = {
  warehouse: WarehouseItem;
};

export function WarehouseCard({ warehouse }: Props) {
  const capacity = warehouse.capacityPct ?? 85;

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-50 text-blue-900 rounded-xl group-hover:bg-blue-900 group-hover:text-white transition-colors">
          <Warehouse className="w-6 h-6" />
        </div>

        <button className="text-gray-400 hover:text-gray-600">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <h3 className="text-lg font-bold text-gray-900">{warehouse.name}</h3>

      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
        <span className="font-semibold text-blue-900/50">{warehouse.code}</span>
        {warehouse.location ? (
          <>
            {" "}
            • {warehouse.location}
          </>
        ) : null}
      </p>

      <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
        <div className="text-xs text-gray-400">
          Capacidad: <span className="text-gray-900 font-semibold">{capacity}%</span>
        </div>

        <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-900" style={{ width: `${capacity}%` }} />
        </div>
      </div>
    </div>
  );
}