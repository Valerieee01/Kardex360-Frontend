import { useEffect, useMemo, useState } from "react";
import { toast, Toaster } from "sonner";
import { authTokens } from "../app/Shared/http";
import { clearStoredUser, getStoredUser, type SessionUser } from "../app/Shared/session";

import Sidebar from "./Sidebar";
import HeaderBar from "./HeaderBar";
import ModuleRenderer, { type ModuleKey } from "./ModuleRender";
import AddProductModal from "../Modules/Inventario/AddProductModal";
import { WAREHOUSES } from "../Modules/Inventario/InventoryPage";

type Props = {
  onLogout: () => void;
};

export default function AppLayout({ onLogout }: Props) {
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [currentModule, setCurrentModule] = useState<ModuleKey>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        currentModule={currentModule}
        onChangeModule={setCurrentModule}
        user={user}
        isAdmin={isAdmin}
        onLogout={handleLogout}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <HeaderBar
          onOpenSidebar={() => setIsSidebarOpen(true)}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          user={user}
        />

        <main className="p-4 lg:p-8">
          <ModuleRenderer
            module={currentModule}
            searchQuery={searchQuery}
            onAddProduct={() => setShowAddProduct(true)}
          />
        </main>
      </div>

      {/* ✅ AQUÍ ESTÁ EL MODAL */}
      <AddProductModal
        open={showAddProduct}
        onClose={() => setShowAddProduct(false)}
        warehouses={WAREHOUSES}
      />

      <Toaster position="top-right" />
    </div>
  );
}