import DashboardPage from "../Modules/Dashboard/DashboardPage";
import InventoryPage from "../Modules/Inventario/InventoryPage";
import { SalesPage } from "../Modules/Movimientos/Ventas/VentsPage";
import { EntradasPage } from "../Modules/Movimientos/Entradas/EntradasPage";
import { TransfersPage } from "../Modules/Movimientos/Traspasos/TraspasosPage";
import { MovimientosPage } from "../Modules/Movimientos/Resumen/MovimientosPage";
import { WarehousesPage } from "../Modules/Bodegas/BodegasPage";
import { SizesPage } from "../Modules/Tallas/TallasPage";
import { UsersPage } from "../Modules/Usuarios/UsersPage";
import { RolesPage } from "../Modules/Roles/RolesPage";
import { ReportsPage } from "../Modules/Reportes/ReportesPage";
import { SettingsPage } from "../Modules/Configuracion/ConfigurationPage";
import type { MovementApiItem } from "../Modules/Movimientos/Ventas/ventas.types";
import type { ModuleKey } from "./layout.types";

export type { ModuleKey };

type Props = {
  module: ModuleKey;
  searchQuery: string;
  onAddProduct: () => void;
  editingMovement?: MovementApiItem | null;
  onClearEdit?: () => void;
  onNavigate?: (module: ModuleKey, movement?: MovementApiItem) => void;
};

export default function ModuleRenderer({
  module,
  searchQuery,
  onAddProduct,
  editingMovement,
  onClearEdit,
  onNavigate,
}: Props) {
  switch (module) {
    case "dashboard":
      return <DashboardPage />;

    case "inventory":
      return <InventoryPage />;

    case "sales":
      return <SalesPage editingMovement={editingMovement} onClearEdit={onClearEdit} />;

    case "entries":
      return <EntradasPage editingMovement={editingMovement} onClearEdit={onClearEdit} />;

    case "transfers":
      return <TransfersPage editingMovement={editingMovement} onClearEdit={onClearEdit} />;

    case "movements":
      return <MovimientosPage onNavigate={onNavigate ?? (() => {})} />;

    case "warehouses":
      return <WarehousesPage />;

    case "sizes":
      return <SizesPage />;

    case "users":
      return <UsersPage />;

    case "roles":
      return <RolesPage />;

    case "reports":
      return <ReportsPage />;

    case "settings":
      return <SettingsPage />;

    default:
      return <DashboardPage />;
  }
}
