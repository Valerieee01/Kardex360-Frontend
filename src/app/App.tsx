import React, { useState } from 'react';
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

const InventoryRow = ({ item }: { item: typeof INVENTORY_DATA[0] }) => (
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggedIn(true);
    toast.success('Bienvenido al Sistema Kardex');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    toast.info('Sesión cerrada correctamente');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-blue-900 p-8 text-white text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-md">
                <Package className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Kardex Pro</h1>
            <p className="text-blue-100 mt-2">Sistema de Gestión de Inventario</p>
          </div>
          
          <div className="p-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Identificación / Usuario</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    required 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all outline-none"
                    placeholder="Ingrese su usuario"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    required 
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900 focus:border-transparent transition-all outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-900 focus:ring-blue-900" />
                  <span className="text-gray-600 group-hover:text-gray-900">Recordarme</span>
                </label>
                <a href="#" className="text-blue-700 hover:underline font-medium">¿Olvidó su contraseña?</a>
              </div>

              <button 
                type="submit" 
                className="w-full py-3.5 bg-blue-900 hover:bg-blue-800 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
              >
                Iniciar Sesión
              </button>
            </form>
          </div>
        </div>
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-900 p-2 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Kardex Pro</span>
            </div>
            <button className="lg:hidden text-gray-400" onClick={() => setIsSidebarOpen(false)}>
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <SidebarItem icon={LayoutDashboard} label="Dashboard" active={currentModule === 'dashboard'} onClick={() => setCurrentModule('dashboard')} />
            <SidebarItem icon={Package} label="Inventario" active={currentModule === 'inventory'} onClick={() => setCurrentModule('inventory')} />
            <SidebarItem icon={ShoppingCart} label="Ventas" active={currentModule === 'sales'} onClick={() => setCurrentModule('sales')} />
            <SidebarItem icon={ArrowLeftRight} label="Traspasos" active={currentModule === 'transfers'} onClick={() => setCurrentModule('transfers')} />
            <SidebarItem icon={Warehouse} label="Bodegas" active={currentModule === 'warehouses'} onClick={() => setCurrentModule('warehouses')} />
            <div className="my-4 border-t border-gray-100 pt-4">
              <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Administración</p>
              <SidebarItem icon={Users} label="Usuarios" active={currentModule === 'users'} onClick={() => setCurrentModule('users')} />
              <SidebarItem icon={ShieldCheck} label="Roles y Permisos" active={currentModule === 'roles'} onClick={() => setCurrentModule('roles')} />
              <SidebarItem icon={BarChart3} label="Reportes" active={currentModule === 'reports'} onClick={() => setCurrentModule('reports')} />
              <SidebarItem icon={Settings} label="Configuración" active={currentModule === 'settings'} onClick={() => setCurrentModule('settings')} />
            </div>
          </nav>

          {/* User Profile Summary */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold">
                AK
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">Admin Kardex</p>
                <p className="text-xs text-gray-500 truncate">admin@kardex.com</p>
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="px-4 lg:px-8 h-16 flex items-center justify-between">
            <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg" onClick={() => setIsSidebarOpen(true)}>
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
                <p className="text-sm font-semibold text-gray-900">Admin Kardex</p>
                <p className="text-xs text-emerald-600 font-medium">Administrador</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">
          {currentModule === 'dashboard' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-500">Resumen general de operaciones del día.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Total Productos" value="1,284" icon={Package} color="bg-blue-900" />
                <StatCard label="Stock Disponible" value="45,200" icon={Warehouse} color="bg-emerald-500" />
                <StatCard label="Ventas del Día" value="$2,450.00" icon={ShoppingCart} color="bg-indigo-600" />
                <StatCard label="Traspasos Hoy" value="12" icon={ArrowLeftRight} color="bg-orange-500" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-gray-900">Movimientos Semanales</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-3 h-3 bg-blue-900 rounded-full"></span> Ventas
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <span className="w-3 h-3 bg-emerald-500 rounded-full"></span> Traspasos
                      </div>
                    </div>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={CHART_DATA}>
                        <defs>
                          <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorTraspasos" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                        <RechartsTooltip 
                          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                        />
                        <Area type="monotone" dataKey="ventas" stroke="#1e3a8a" strokeWidth={3} fillOpacity={1} fill="url(#colorVentas)" />
                        <Area type="monotone" dataKey="traspasos" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorTraspasos)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                  <h3 className="font-bold text-gray-900 mb-6">Últimos Movimientos</h3>
                  <div className="space-y-6">
                    {RECENT_MOVEMENTS.map((mv) => (
                      <div key={mv.id} className="flex items-start gap-4">
                        <div className={`mt-1 p-2 rounded-lg ${
                          mv.type === 'venta' ? 'bg-blue-50 text-blue-600' : 
                          mv.type === 'traspaso' ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {mv.type === 'venta' ? <ShoppingCart className="w-4 h-4" /> : 
                           mv.type === 'traspaso' ? <ArrowLeftRight className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{mv.product}</p>
                          <p className="text-xs text-gray-500">{mv.date} • {mv.user}</p>
                        </div>
                        <div className="text-sm font-bold text-gray-900">
                          {mv.type === 'venta' ? '-' : '+'}{mv.qty}
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-6 py-2.5 text-sm font-semibold text-blue-900 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    Ver todos los movimientos
                  </button>
                </div>
              </div>
            </div>
          )}

          {currentModule === 'inventory' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Inventario</h2>
                  <p className="text-gray-500">Gestione sus productos y niveles de stock.</p>
                </div>
                <button 
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/10 active:scale-95"
                >
                  <Plus className="w-5 h-5" />
                  Agregar Producto
                </button>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-[200px] relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Filtrar por referencia o descripción..." 
                      className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all outline-none text-sm"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-900/10">
                      <option>Todas las Bodegas</option>
                      {WAREHOUSES.map(b => <option key={b.code}>{b.name}</option>)}
                    </select>
                    <select className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-900/10">
                      <option>Todos los Estados</option>
                      <option>Activo</option>
                      <option>Bajo Stock</option>
                      <option>Inactivo</option>
                    </select>
                    <button className="p-2 text-gray-500 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all">
                      <Filter className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Imagen</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Referencia</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Descripción</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Talla</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cantidad</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Bodega</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {INVENTORY_DATA.map((item) => (
                        <InventoryRow key={item.id} item={item} />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-sm text-gray-500">Mostrando 1-4 de 1,284 productos</p>
                  <div className="flex items-center gap-2">
                    <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600 disabled:opacity-50">Anterior</button>
                    <button className="px-3 py-1 bg-blue-900 text-white rounded-md text-sm">1</button>
                    <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600">2</button>
                    <button className="px-3 py-1 border border-gray-200 rounded-md text-sm text-gray-600">Siguiente</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentModule === 'sales' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Nueva Venta</h2>
                  <p className="text-gray-500">Registre una salida de inventario por venta.</p>
                </div>
                
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Producto / Referencia</label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all">
                        <option>Seleccione un producto</option>
                        {INVENTORY_DATA.map(p => <option key={p.id}>{p.ref} - {p.desc}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Talla</label>
                      <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Ej: M, 42, N/A" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                      <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bodega Origen</label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                        {WAREHOUSES.map(w => <option key={w.code}>{w.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Precio Unitario ($)</label>
                      <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="0.00" />
                    </div>
                  </div>
                  
                  <div className="pt-4">
                    <button 
                      onClick={() => toast.success('Venta registrada con éxito. Stock actualizado.')}
                      className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                    >
                      Confirmar Venta y Descontar Stock
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Ventas Recientes</h2>
                  <p className="text-gray-500">Historial de las últimas operaciones de venta.</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100">
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Ref</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Cant</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Total</th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {SALES_DATA.map(s => (
                        <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gray-900">{s.ref}</td>
                          <td className="px-6 py-4 text-gray-600">{s.qty}</td>
                          <td className="px-6 py-4 font-bold text-gray-900">${s.price.toFixed(2)}</td>
                          <td className="px-6 py-4 text-gray-500 text-right text-sm">{s.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="p-4 bg-gray-50/50 text-center">
                    <button className="text-sm font-semibold text-blue-900 hover:underline">Ver reporte completo de ventas</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentModule === 'transfers' && (
             <div className="max-w-4xl mx-auto space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Traspasos entre Bodegas</h2>
                  <p className="text-gray-500">Mueva stock de una ubicación a otra de forma segura.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Seleccionar Producto</label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                        <option>Elija el producto a trasparar</option>
                        {INVENTORY_DATA.map(p => <option key={p.id}>{p.ref} - {p.desc} (Stock: {p.qty})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bodega Origen</label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                        {WAREHOUSES.map(w => <option key={w.code}>{w.name}</option>)}
                      </select>
                    </div>
                    <div className="flex items-center justify-center hidden md:flex pt-8">
                       <ArrowLeftRight className="w-8 h-8 text-blue-900/20" />
                    </div>
                    <div className="hidden md:block"></div> {/* Spacer */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bodega Destino</label>
                      <select className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                        <option>Seleccione destino</option>
                        {WAREHOUSES.map(w => <option key={w.code}>{w.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad a Trasladar</label>
                      <input type="number" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="0" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Observaciones / Motivo</label>
                      <textarea className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none min-h-[100px]" placeholder="Ej: Reabastecimiento de sucursal centro..."></textarea>
                    </div>
                  </div>

                  <div className="mt-8 flex items-center justify-end gap-4">
                    <button className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all">Cancelar</button>
                    <button 
                      onClick={() => toast.success('Traspaso procesado correctamente')}
                      className="px-8 py-3 bg-blue-900 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
                    >
                      Ejecutar Traspaso
                    </button>
                  </div>
                </div>
             </div>
          )}

          {currentModule === 'warehouses' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Gestión de Bodegas</h2>
                  <p className="text-gray-500">Administre las ubicaciones físicas de su inventario.</p>
                </div>
                <button className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2.5 rounded-xl font-semibold">
                  <Plus className="w-5 h-5" /> Nueva Bodega
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {WAREHOUSES.map(w => (
                  <div key={w.code} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-3 bg-blue-50 text-blue-900 rounded-xl group-hover:bg-blue-900 group-hover:text-white transition-colors">
                        <Warehouse className="w-6 h-6" />
                      </div>
                      <button className="text-gray-400 hover:text-gray-600"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">{w.name}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                      <span className="font-semibold text-blue-900/50">{w.code}</span> • {w.location}
                    </p>
                    <div className="mt-6 pt-6 border-t border-gray-50 flex items-center justify-between">
                       <div className="text-xs text-gray-400">Capacidad: <span className="text-gray-900 font-semibold">85%</span></div>
                       <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="w-[85%] h-full bg-blue-900"></div>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {currentModule === 'users' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Usuarios del Sistema</h2>
                  <p className="text-gray-500">Control de acceso y personal autorizado.</p>
                </div>
                <button className="bg-blue-900 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" /> Crear Usuario
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nombre Completo</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rol</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {USERS.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-gray-500">{u.id}</td>
                        <td className="px-6 py-4">
                           <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-700">
                                {u.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-semibold text-gray-900">{u.name}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{u.role}</td>
                        <td className="px-6 py-4">
                           <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">Activo</span>
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                           <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">Editar</button>
                           <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors">Eliminar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {currentModule === 'roles' && (
            <div className="max-w-4xl mx-auto space-y-8">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900">Roles y Permisos</h2>
                  <p className="text-gray-500">Defina qué módulos puede ver cada tipo de usuario.</p>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                     <h3 className="font-bold text-gray-900">Asignación de Permisos</h3>
                     <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none font-semibold text-sm">
                        <option>Seleccionar Rol: Vendedor</option>
                        <option>Administrador</option>
                        <option>Supervisor</option>
                     </select>
                  </div>
                  <div className="p-6 space-y-4">
                     {[
                       { m: 'Inventario', p: 'Ver, Editar, Crear' },
                       { m: 'Ventas', p: 'Registrar Ventas' },
                       { m: 'Traspasos', p: 'Ver y Crear' },
                       { m: 'Reportes', p: 'Sin Acceso' },
                       { m: 'Configuración', p: 'Sin Acceso' }
                     ].map((mod, idx) => (
                       <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div>
                             <p className="font-bold text-gray-900">{mod.m}</p>
                             <p className="text-sm text-gray-500">{mod.p}</p>
                          </div>
                          <div className="flex gap-4">
                             <label className="flex items-center gap-2 cursor-pointer">
                                <input type="checkbox" checked={mod.p !== 'Sin Acceso'} className="w-5 h-5 rounded border-gray-300 text-blue-900 focus:ring-blue-900" />
                                <span className="text-sm font-medium">Habilitado</span>
                             </label>
                          </div>
                       </div>
                     ))}
                  </div>
                  <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end">
                     <button className="px-6 py-2.5 bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/10">Guardar Cambios</button>
                  </div>
                </div>
            </div>
          )}

          {currentModule === 'reports' && (
            <div className="space-y-8 max-w-7xl mx-auto">
               <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Centro de Reportes</h2>
                  <p className="text-gray-500">Analice el rendimiento y rotación de stock.</p>
                </div>
                <button className="flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-all">
                  <Download className="w-5 h-5" /> Exportar a Excel
                </button>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                 <div className="flex flex-wrap gap-4 mb-8">
                    <div className="flex-1 min-w-[200px]">
                       <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Rango de Fecha</label>
                       <input type="date" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none" />
                    </div>
                    <div className="flex-1 min-w-[200px]">
                       <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Bodega</label>
                       <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none">
                          <option>Todas las Bodegas</option>
                       </select>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                       <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Tipo Movimiento</label>
                       <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none">
                          <option>Todos</option>
                          <option>Ventas</option>
                          <option>Traspasos</option>
                       </select>
                    </div>
                    <div className="flex items-end">
                       <button className="px-6 py-2 bg-blue-900 text-white font-bold rounded-lg h-[42px]">Filtrar</button>
                    </div>
                 </div>

                 <div className="h-[400px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={CHART_DATA}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                        <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                        <Bar dataKey="ventas" fill="#1e3a8a" radius={[4, 4, 0, 0]} barSize={40} />
                        <Bar dataKey="traspasos" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                 </div>
              </div>
            </div>
          )}

          {currentModule === 'settings' && (
            <div className="max-w-2xl mx-auto space-y-8">
               <div>
                  <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
                  <p className="text-gray-500">Datos generales y parámetros administrativos.</p>
                </div>

                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                   <div className="flex justify-center mb-8">
                      <div className="relative group">
                         <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden group-hover:border-blue-900 transition-colors">
                            <Package className="w-10 h-10 text-gray-300 group-hover:text-blue-900" />
                         </div>
                         <button className="absolute -bottom-2 -right-2 p-2 bg-blue-900 text-white rounded-lg shadow-lg">
                            <Plus className="w-4 h-4" />
                         </button>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">NIT / Identificación Empresa</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" defaultValue="900.123.456-7" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Sistema / Razón Social</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" defaultValue="Kardex Pro Solutions S.A." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación Principal</label>
                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" defaultValue="Calle 100 #15-30, Bogotá, Colombia" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email de Soporte</label>
                        <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none" defaultValue="soporte@kardexpro.com" />
                      </div>
                   </div>

                   <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
                      <button className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl">Restablecer</button>
                      <button 
                        onClick={() => toast.success('Configuración guardada')}
                        className="px-6 py-2.5 bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/10"
                      >
                        Guardar Cambios
                      </button>
                   </div>
                </div>
            </div>
          )}
        </main>
      </div>

      {/* Add Product Modal (Simple implementation) */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
           <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-900 text-white">
                 <h3 className="text-xl font-bold">Agregar Nuevo Producto</h3>
                 <button onClick={() => setShowAddProduct(false)} className="p-2 hover:bg-white/10 rounded-lg"><X className="w-6 h-6" /></button>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Referencia</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="REF-001" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="Nombre del producto" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Talla</label>
                    <input type="text" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="M, L, XL..." />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad Inicial</label>
                    <input type="number" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="0" />
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bodega</label>
                    <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none">
                       {WAREHOUSES.map(w => <option key={w.code}>{w.name}</option>)}
                    </select>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor Unitario ($)</label>
                    <input type="number" className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none" placeholder="0.00" />
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-900 transition-colors cursor-pointer">
                       <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                       <p className="text-sm text-gray-500">Haga clic para subir o arrastre una imagen</p>
                    </div>
                 </div>
              </div>
              <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                 <button onClick={() => setShowAddProduct(false)} className="px-6 py-2.5 text-gray-600 font-semibold">Cancelar</button>
                 <button 
                  onClick={() => {
                    toast.success('Producto agregado correctamente');
                    setShowAddProduct(false);
                  }}
                  className="px-8 py-2.5 bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/10"
                >
                  Guardar Producto
                </button>
              </div>
           </div>
        </div>
      )}

      <Toaster position="top-right" richColors />
    </div>
  );
}
