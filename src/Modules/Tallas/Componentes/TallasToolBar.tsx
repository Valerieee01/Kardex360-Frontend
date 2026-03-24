import { Search } from "lucide-react";

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
};

export function SizesToolbar({ query, onQueryChange }: Props) {
  return (
    <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center gap-4">
      <div className="flex-1 min-w-[200px] relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          type="text"
          placeholder="Filtrar por talla..."
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all outline-none text-sm"
        />
      </div>
    </div>
  );
}