import { useState, useEffect } from "react";
import { Bell, Menu, Clock } from "lucide-react";
import type { SessionUser } from "../app/Shared/session";

type Props = {
  onOpenSidebar: () => void;
  user: SessionUser | null;
};

export default function HeaderBar({ onOpenSidebar, user }: Props) {
  const isAdmin = user?.roles?.includes("ROL-ADMIN");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const fecha = now.toLocaleDateString("es-CO", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const hora = now.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
        <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg" onClick={onOpenSidebar}>
          <Menu className="w-6 h-6" />
        </button>

        {/* Fecha y hora en tiempo real */}
        <div className="flex items-center gap-2 text-gray-500">
          <Clock className="w-4 h-4 shrink-0" />
          <div className="hidden sm:flex items-baseline gap-2">
            <span className="text-sm text-gray-400 capitalize">{fecha}</span>
            <span className="text-sm font-semibold text-gray-700 tabular-nums">{hora}</span>
          </div>
          <span className="sm:hidden text-sm font-semibold text-gray-700 tabular-nums">{hora}</span>
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
