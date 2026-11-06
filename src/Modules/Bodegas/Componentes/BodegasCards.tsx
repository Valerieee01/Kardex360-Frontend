import { Pencil, Trash2, Warehouse, Package } from "lucide-react";
import type { WarehouseItem } from "../BodegasTypes";

type Props = {
  warehouse: WarehouseItem;
  onEdit: (warehouse: WarehouseItem) => void;
  onDelete: (warehouse: WarehouseItem) => void;
  onViewStock: (warehouse: WarehouseItem) => void;
};

export function WarehouseCard({ warehouse, onEdit, onDelete, onViewStock }: Props) {
  return (
    <div
      className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer"
      onClick={() => onViewStock(warehouse)}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="p-3 bg-blue-50 text-blue-900 rounded-xl group-hover:bg-blue-900 group-hover:text-white transition-colors">
          <Warehouse className="w-6 h-6" />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(warehouse); }}
            className="p-2 rounded-lg text-gray-400 hover:text-blue-700 hover:bg-blue-50"
            title="Editar"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); onDelete(warehouse); }}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900">{warehouse.name}</h3>

      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
        <span className="font-semibold text-blue-900/50">{warehouse.code}</span>
        {warehouse.location ? <> • {warehouse.location}</> : null}
      </p>

      <div className="mt-3">
        <span
          className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
            warehouse.estado
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {warehouse.estado ? "Activa" : "Inactiva"}
        </span>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Package className="w-3.5 h-3.5" />
          Unidades en stock
        </div>
        <span className="text-sm font-bold text-blue-900">
          {warehouse.totalUnidades ?? 0}
        </span>
      </div>
    </div>
  );
}