import type { ReportFilters, ReportMovementType } from "../Reportes.types";

type WarehouseOpt = { code: string; name: string };
type UserOpt = { id: string; name: string };

type Props = {
  value: ReportFilters;
  onChange: (next: ReportFilters) => void;
  onSubmit: () => void;
  warehouses: WarehouseOpt[];
  users: UserOpt[];
};

export function ReportsFilters({ value, onChange, onSubmit, warehouses, users }: Props) {
  const set = <K extends keyof ReportFilters>(key: K, v: ReportFilters[K]) =>
    onChange({ ...value, [key]: v });

  return (
    <div className="space-y-4 mb-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fecha desde */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">
            Fecha desde
          </label>
          <input
            type="date"
            value={value.dateFrom}
            onChange={(e) => set("dateFrom", e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
          />
        </div>

        {/* Fecha hasta */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">
            Fecha hasta
          </label>
          <input
            type="date"
            value={value.dateTo}
            min={value.dateFrom || undefined}
            onChange={(e) => set("dateTo", e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
          />
        </div>

        {/* Bodega */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">
            Bodega
          </label>
          <select
            value={value.warehouse}
            onChange={(e) => set("warehouse", e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
          >
            {warehouses.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tipo */}
        <div>
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">
            Tipo de movimiento
          </label>
          <select
            value={value.movementType}
            onChange={(e) => set("movementType", e.target.value as ReportMovementType)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
          >
            <option value="ALL">Todos</option>
            <option value="VENTAS">Ventas</option>
            <option value="ENTRADAS">Entradas</option>
            <option value="TRASPASOS">Traspasos</option>
          </select>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4">
        {/* Usuario */}
        <div className="flex-1 max-w-xs">
          <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">
            Responsable
          </label>
          <select
            value={value.userId}
            onChange={(e) => set("userId", e.target.value)}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
          >
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end gap-3 pt-5">
          <button
            type="button"
            onClick={() => {
              onChange({
                dateFrom: "",
                dateTo: "",
                warehouse: "ALL",
                userId: "ALL",
                movementType: "ALL",
              });
            }}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 text-sm"
          >
            Limpiar
          </button>
          <button
            type="button"
            onClick={onSubmit}
            className="px-6 py-2.5 bg-blue-900 text-white font-bold rounded-xl text-sm hover:bg-blue-800"
          >
            Filtrar
          </button>
        </div>
      </div>
    </div>
  );
}
