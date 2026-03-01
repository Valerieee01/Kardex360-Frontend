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

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={() => setIsLoggedIn(true)} />;
  }

    return <AppLayout onLogout={() => setIsLoggedIn(false)} />;

 /*
  return (
    
        
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
                    <div className="hidden md:block"></div> {/* Spacer }
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

      {/* Add Product Modal (Simple implementation) }
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
  */
}
