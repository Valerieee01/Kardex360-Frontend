import { Filter, Search } from "lucide-react";
import type { SizeCategory, SizeStatus } from "../sizes.types";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;

  category: SizeCategory | "ALL";
  onCategoryChange: (value: SizeCategory | "ALL") => void;

  status: SizeStatus | "ALL";
  onStatusChange: (value: SizeStatus | "ALL") => void;
};

export function SizesToolbar({
  query,
  onQueryChange,
  category,
  onCategoryChange,
  status,
  onStatusChange,
}: Props) {
  return (
    <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          type="text"
          placeholder="Filtrar por código o nombre..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all outline-none text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <select
          value={category}
          onChange={(e) => onCategoryChange(e.target.value as SizeCategory | "ALL")}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-900/10"
        >
          <option value="ALL">Todas las Categorías</option>
          <option value="Ropa">Ropa</option>
          <option value="Calzado">Calzado</option>
        </select>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as SizeStatus | "ALL")}
          className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-900/10"
        >
          <option value="ALL">Todos los Estados</option>
          <option value="Activo">Activo</option>
          <option value="Inactivo">Inactivo</option>
        </select>

        <button className="p-2 text-gray-500 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all">
          <Filter className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}