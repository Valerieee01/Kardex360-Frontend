import DashboardPage from "../Modules/Dashboard/DashboardPage";
import InventoryPage from "../Modules/Inventario/InventoryPage";
/*
import SalesPage from "../modules/sales/SalesPage";
import TransfersPage from "../modules/transfers/TransfersPage";
import WarehousesPage from "../modules/warehouses/WarehousesPage";
import UsersPage from "../modules/users/UsersPage";
import RolesPage from "../modules/roles/RolesPage";
import ReportsPage from "../modules/reports/ReportsPage";
import SettingsPage from "../modules/settings/SettingsPage";
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
  | "settings";

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
/*
    case "sales":
      return <SalesPage />;

    case "transfers":
      return <TransfersPage />;

    case "warehouses":
      return <WarehousesPage />;

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

      */
  }
}