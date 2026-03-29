import { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import { authTokens } from "../app/Shared/http";
import { clearStoredUser, getStoredUser, type SessionUser } from "../app/Shared/session";

import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";
import ModuleRenderer, { type ModuleKey } from "./ModuleRender";
import AddProductModal from "../Modules/Inventario/AddProductModal";

type Props = {
  onLogout: () => void;
};

export default function AppLayout({ onLogout }: Props) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [currentModule, setCurrentModule] = useState<ModuleKey>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // default cerrado en mobile
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    const u = getStoredUser();
    setUser(u);
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

  return (
    <div className="flex h-screen overflow-hidden bg-[#F8FAFC]">

      {/* Overlay para mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar: fijo en desktop, overlay en mobile */}
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
          onChangeModule={(mod) => {
            setCurrentModule(mod);
            setIsSidebarOpen(false); // cierra en mobile al navegar
          }}
          user={user}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col min-w-0 h-screen overflow-hidden">
        <HeaderBar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={user}
        />

        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          <ModuleRenderer
            module={currentModule}
            searchQuery={searchQuery}
            onAddProduct={() => setShowAddProduct(true)}
          />
        </main>
      </div>

      <Toaster position="top-right" />
    </div>
  );
}