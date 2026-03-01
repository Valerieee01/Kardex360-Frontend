import { Bell, Menu, Search } from "lucide-react";
import type { SessionUser } from "../app/Shared/session";

type Props = {
  onOpenSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  user: SessionUser | null;
};

export default function HeaderBar({ onOpenSidebar, searchQuery, setSearchQuery, user }: Props) {
  const isAdmin = user?.roles?.includes("ROL-ADMIN");

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
        <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg" onClick={onOpenSidebar}>
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex-1 max-w-xl mx-4 lg:mx-0">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-900 transition-colors" />
            <input
              type="text"
              placeholder="Buscar productos, ventas, referencias..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all outline-none text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 lg:gap-4">
          <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>

          <div className="h-8 w-px bg-gray-200 mx-1 hidden sm:block"></div>

          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-gray-900">{user?.nombre ?? "Usuario"}</p>
            <p className="text-xs text-emerald-600 font-medium">{isAdmin ? "Administrador" : "Usuario"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}