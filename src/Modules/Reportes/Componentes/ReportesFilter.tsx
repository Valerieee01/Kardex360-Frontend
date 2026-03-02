import type { ReportFilters, ReportMovementType } from "../Reportes.types";

type WarehouseOpt = { code: string; name: string };
type UserOpt = { id: string; name: string };

type Props = {
  value: ReportFilters;
  onChange: (next: ReportFilters) => void;
  onSubmit: () => void;
  warehouses: WarehouseOpt[];
  users: UserOpt[]; // ✅ nuevo
};

export function ReportsFilters({ value, onChange, onSubmit, warehouses, users }: Props) {
  const set = <K extends keyof ReportFilters>(key: K, v: ReportFilters[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="flex flex-wrap gap-4 mb-8">
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
          Rango de Fecha
        </label>
        <input
          type="date"
          value={value.dateFrom}
          onChange={(e) => set("dateFrom", e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
        />
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Bodega</label>
        <select
          value={value.warehouse}
          onChange={(e) => set("warehouse", e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
        >
          {warehouses.map((w) => (
            <option key={w.code} value={w.code}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {/* ✅ Nuevo: filtro por usuario */}
      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Usuario</label>
        <select
          value={value.userId}
          onChange={(e) => set("userId", e.target.value)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
        >
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex-1 min-w-[200px]">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">
          Tipo Movimiento
        </label>
        <select
          value={value.movementType}
          onChange={(e) => set("movementType", e.target.value as ReportMovementType)}
          className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none"
        >
          <option value="ALL">Todos</option>
          <option value="VENTAS">Ventas</option>
          <option value="TRASPASOS">Traspasos</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-blue-900 text-white font-bold rounded-lg h-[42px]"
        >
          Filtrar
        </button>
      </div>
    </div>
  );
}