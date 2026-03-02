import DashboardPage from "../Modules/Dashboard/DashboardPage";
import InventoryPage from "../Modules/Inventario/InventoryPage";
import {SalesPage} from "../Modules/Movimientos/Ventas/VentsPage";
import {TransfersPage} from "../Modules/Movimientos/Traspasos/TraspasosPage";
import {WarehousesPage} from "../Modules/Bodegas/BodegasPage";
import {SizesPage} from "../Modules/Tallas/TallasPage";
import {UsersPage} from "../Modules/Usuarios/UsersPage";
import {RolesPage} from "../Modules/Roles/RolesPage";
import {ReportsPage} from "../Modules/Reportes/ReportesPage";
import {SettingsPage} from "../Modules/Configuracion/ConfigurationPage";

/*
*/
export type ModuleKey =
  | "dashboard"
  | "inventory"
  | "sales"
  | "transfers"
  | "warehouses"
  | "users"
  | "roles"
  | "reports"
  | "settings"
  | "sizes";

type Props = {
  module: ModuleKey;
  searchQuery: string;
  onAddProduct: () => void;
};

export default function ModuleRenderer({ module, searchQuery, onAddProduct }: Props) {
  switch (module) {
    case "dashboard":
      return <DashboardPage />;

    case "inventory":
      return <InventoryPage onAddProduct={onAddProduct} />;

    case "sales":
      return <SalesPage />;

    case "transfers":
      return <TransfersPage />;


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
        /*
        






    default:
      return <DashboardPage />;

      */
  }
}