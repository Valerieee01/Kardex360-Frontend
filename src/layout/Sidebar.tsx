import {
  LayoutDashboard, Package, ShoppingCart, ArrowLeftRight,
  Warehouse, Users, ShieldCheck, Settings, BarChart3,
  LogOut, X, Ruler,
} from "lucide-react";
import type { SessionUser } from "../app/Shared/session";
import SidebarItem from "./SidebarItem";
import type { ModuleKey } from "./ModuleRender";
import { hasPermission } from "../app/Shared/permissions";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  currentModule: ModuleKey;
  onChangeModule: (m: ModuleKey) => void;
  user: SessionUser | null;
  isAdmin: boolean;
  onLogout: () => void;
};

export default function Sidebar({
  isOpen,
  onClose,
  currentModule,
  onChangeModule,
  user,
  isAdmin,
  onLogout,
}: Props) {
  const canInventory = hasPermission(user, "PERM-INVENT");
  const canSales = hasPermission(user, "PERM-VENTAS");
  const canTransfers = hasPermission(user, "PERM-TRASP");
  const canReports = hasPermission(user, "PERM-REPORT");
  const canSettings = hasPermission(user, "PERM-CONFIG");

  return (
    // ✅ Sin fixed, sin transform — AppLayout se encarga de eso
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">

      {/* Logo */}
      <div className="p-6 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-900 p-2 rounded-lg">
            <Package className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">Kardex Pro</span>
        </div>
        <button className="lg:hidden text-gray-400" onClick={onClose}>
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        <SidebarItem
          icon={LayoutDashboard}
          label="Dashboard"
          active={currentModule === "dashboard"}
          onClick={() => onChangeModule("dashboard")}
        />

        {canInventory && (
          <SidebarItem
            icon={Package}
            label="Inventario"
            active={currentModule === "inventory"}
            onClick={() => onChangeModule("inventory")}
          />
        )}

        {canInventory && (
          <SidebarItem
            icon={Ruler}
            label="Catálogo de Tallas"
            active={currentModule === "sizes"}
            onClick={() => onChangeModule("sizes")}
          />
        )}

        {canSales && (
          <SidebarItem
            icon={ShoppingCart}
            label="Ventas"
            active={currentModule === "sales"}
            onClick={() => onChangeModule("sales")}
          />
        )}

        {canTransfers && (
          <SidebarItem
            icon={ArrowLeftRight}
            label="Traspasos"
            active={currentModule === "transfers"}
            onClick={() => onChangeModule("transfers")}
          />
        )}

        {canInventory && (
          <SidebarItem
            icon={Warehouse}
            label="Bodegas"
            active={currentModule === "warehouses"}
            onClick={() => onChangeModule("warehouses")}
          />
        )}

        {(isAdmin || canReports || canSettings) && (
          <div className="my-4 border-t border-gray-100 pt-4">
            <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Administración
            </p>

            {isAdmin && (
              <SidebarItem
                icon={Users}
                label="Usuarios"
                active={currentModule === "users"}
                onClick={() => onChangeModule("users")}
              />
            )}

            {isAdmin && (
              <SidebarItem
                icon={ShieldCheck}
                label="Roles y Permisos"
                active={currentModule === "roles"}
                onClick={() => onChangeModule("roles")}
              />
            )}

            {canReports && (
              <SidebarItem
                icon={BarChart3}
                label="Reportes"
                active={currentModule === "reports"}
                onClick={() => onChangeModule("reports")}
              />
            )}

            {canSettings && (
              <SidebarItem
                icon={Settings}
                label="Configuración"
                active={currentModule === "settings"}
                onClick={() => onChangeModule("settings")}
              />
            )}
          </div>
        )}
      </nav>

      {/* Usuario */}
      <div className="p-4 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold">
            {(user?.nombre?.[0] ?? "U").toUpperCase()}
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user?.nombre ?? "Usuario"}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.id ?? ""}
            </p>
          </div>
          <button
            onClick={onLogout}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}