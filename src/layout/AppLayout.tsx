import { useEffect, useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, Toaster } from "sonner";
import { authTokens } from "../app/Shared/http";
import { clearStoredUser, getStoredUser, type SessionUser } from "../app/Shared/session";

import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";
import ModuleRenderer, { type ModuleKey } from "./ModuleRender";
import AddProductModal from "../Modules/Inventario/AddProductModal";
import { SessionExpiredModal } from "./SessionExpiredModal";
import type { MovementApiItem } from "../Modules/Movimientos/Ventas/ventas.types";
import { MODULE_ROUTES, moduleFromPath } from "./layout.types";

type Props = {
  onLogout: () => void;
};

export default function AppLayout({ onLogout }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);
  const [editingMovement, setEditingMovement] = useState<MovementApiItem | null>(null);
  const [showReauthModal, setShowReauthModal] = useState(false);

  const currentModule: ModuleKey = moduleFromPath(location.pathname);

  useEffect(() => {
    const u = getStoredUser();
    setUser(u);
  }, []);

  useEffect(() => {
    const handleReauthRequired = () => setShowReauthModal(true);
    window.addEventListener("auth:reauth-required", handleReauthRequired);
    return () => window.removeEventListener("auth:reauth-required", handleReauthRequired);
  }, []);

  const isAdmin = useMemo(() => {
    return !!user?.roles?.includes("ROL-ADMIN");
  }, [user]);

  const handleLogout = () => {
    authTokens.clear();
    clearStoredUser();
    toast.info("Sesión cerrada correctamente");
    onLogout();
  };

  const handleNavigate = (module: ModuleKey, movement?: MovementApiItem) => {
    setEditingMovement(movement ?? null);
    navigate(MODULE_ROUTES[module]);
  };

  const handleChangeModule = (mod: ModuleKey) => {
    setEditingMovement(null);
    setIsSidebarOpen(false);
    navigate(MODULE_ROUTES[mod]);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">

      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-30 h-screen
          transition-transform duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:z-auto
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          currentModule={currentModule}
          onChangeModule={handleChangeModule}
          user={user}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
      </aside>

      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        <HeaderBar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          user={user}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <ModuleRenderer
            module={currentModule}
            searchQuery={searchQuery}
            onAddProduct={() => setShowAddProduct(true)}
            editingMovement={editingMovement}
            onClearEdit={() => setEditingMovement(null)}
            onNavigate={handleNavigate}
          />
        </main>
      </div>

      <Toaster position="top-right" />

      {showReauthModal && (
        <SessionExpiredModal
          onSessionRestored={() => setShowReauthModal(false)}
          onLogout={() => {
            setShowReauthModal(false);
            handleLogout();
          }}
        />
      )}
    </div>
  );
}
