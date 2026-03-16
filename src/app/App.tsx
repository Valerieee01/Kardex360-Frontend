import React from 'react';
import { useEffect, useState } from "react";
import LoginPage from "../Modules/Login/LoginPage";
import { authTokens } from "../app/Shared/http";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  ArrowLeftRight, 
  Warehouse, 
  Users, 
  ShieldCheck, 
  Settings, 
  BarChart3, 
  LogOut,
  Menu,
  X,
  User,
  Bell,
  Search,
  Plus,
  Filter,
  MoreVertical,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Download
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { Toaster, toast } from 'sonner';
import { ImageWithFallback } from './components/figma/ImageWithFallback';
import AppLayout from '../layout/AppLayout';

// --- Types ---
type Module = 'dashboard' | 'inventory' | 'sales' | 'transfers' | 'warehouses' | 'users' | 'roles' | 'settings' | 'reports';

// --- Mock Data ---
const RECENT_MOVEMENTS = [
  { id: 1, type: 'venta', product: 'Martillo Industrial', qty: 5, date: '2026-02-04 10:30', user: 'Admin' },
  { id: 2, type: 'traspaso', product: 'Destornillador Pro', qty: 20, date: '2026-02-04 09:15', user: 'Carlos V.' },
  { id: 3, type: 'ingreso', product: 'Taladro Inalámbrico', qty: 10, date: '2026-02-03 16:45', user: 'Marta G.' },
  { id: 4, type: 'venta', product: 'Cinta Métrica 5m', qty: 2, date: '2026-02-03 14:20', user: 'Admin' },
];

const INVENTORY_DATA = [
  { id: 1, ref: 'HER-001', desc: 'Martillo Industrial', size: 'N/A', qty: 45, warehouse: 'B-01', status: 'activo', price: 25.50, image: 'https://images.unsplash.com/photo-1586864387917-f5394726fe4c?w=400' },
  { id: 2, ref: 'HER-002', desc: 'Destornillador Pro', size: 'M', qty: 12, warehouse: 'B-01', status: 'bajo stock', price: 12.00, image: 'https://images.unsplash.com/photo-1530124560676-586cad3ad730?w=400' },
  { id: 3, ref: 'ELE-045', desc: 'Taladro Inalámbrico', size: 'N/A', qty: 8, warehouse: 'B-02', status: 'bajo stock', price: 85.00, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400' },
  { id: 4, ref: 'MED-099', desc: 'Cinta Métrica 5m', size: 'N/A', qty: 120, warehouse: 'B-03', status: 'activo', price: 5.99, image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400' },
];

const SALES_DATA = [
  { id: 101, ref: 'HER-001', size: 'N/A', qty: 2, price: 51.00, warehouse: 'B-01', user: 'Admin', date: '2026-02-04' },
  { id: 102, ref: 'MED-099', size: 'N/A', qty: 5, price: 29.95, warehouse: 'B-03', user: 'Admin', date: '2026-02-03' },
];

const WAREHOUSES = [
  { code: 'B-01', name: 'Bodega Principal', location: 'Ciudad Norte' },
  { code: 'B-02', name: 'Almacén Central', location: 'Centro Histórico' },
  { code: 'B-03', name: 'Depósito Logístico', location: 'Parque Industrial' },
];

const USERS = [
  { id: '1010', name: 'Admin Kardex', role: 'Administrador', status: 'Activo' },
  { id: '2020', name: 'Carlos Villagrán', role: 'Vendedor', status: 'Activo' },
  { id: '3030', name: 'Marta García', role: 'Supervisor', status: 'Activo' },
];

const CHART_DATA = [
  { name: 'Lun', ventas: 4000, traspasos: 2400 },
  { name: 'Mar', ventas: 3000, traspasos: 1398 },
  { name: 'Mie', ventas: 2000, traspasos: 9800 },
  { name: 'Jue', ventas: 2780, traspasos: 3908 },
  { name: 'Vie', ventas: 1890, traspasos: 4800 },
  { name: 'Sab', ventas: 2390, traspasos: 3800 },
  { name: 'Dom', ventas: 3490, traspasos: 4300 },
];

// --- Components ---
const SidebarItem = ({ 
  icon: Icon, 
  label, 
  active, 
  onClick 
}: { 
  icon: any, 
  label: string, 
  active: boolean, 
  onClick: () => void 
}) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
      active 
        ? 'bg-blue-900/10 text-blue-900 font-semibold' 
        : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-blue-900' : 'text-gray-400 group-hover:text-gray-900'}`} />
    <span className="text-sm">{label}</span>
  </button>
);

const StatCard = ({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: string }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

export const InventoryRow = ({ item }: { item: typeof INVENTORY_DATA[0] }) => (
  <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
    <td className="px-6 py-4">
      <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
        <ImageWithFallback src={item.image} alt={item.desc} className="w-full h-full object-cover" />
      </div>
    </td>
    <td className="px-6 py-4 font-medium text-gray-900">{item.ref}</td>
    <td className="px-6 py-4 text-gray-600">{item.desc}</td>
    <td className="px-6 py-4 text-gray-600">{item.size}</td>
    <td className="px-6 py-4 font-semibold text-gray-900">{item.qty}</td>
    <td className="px-6 py-4 text-gray-600">{item.warehouse}</td>
    <td className="px-6 py-4">
      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
        item.status === 'activo' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      }`}>
        {item.status}
      </span>
    </td>
    <td className="px-6 py-4 text-right">
      <button className="text-gray-400 hover:text-gray-600">
        <MoreVertical className="w-5 h-5" />
      </button>
    </td>
  </tr>
);

export default function KardexApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentModule, setCurrentModule] = useState<Module>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Forms states (simplified)
  const [showAddProduct, setShowAddProduct] = useState(false);

  useEffect(() => {
    const { accessToken } = authTokens.get();
    setIsLoggedIn(!!accessToken);
  }, []);

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    toast.success('Bienvenido al Sistema Kardex');
  };

  const handleLogout = () => {
    authTokens.clear();
    setIsLoggedIn(false);
    toast.info('Sesión cerrada correctamente');
  };


    return <AppLayout onLogout={() => setIsLoggedIn(false)} />;

}
