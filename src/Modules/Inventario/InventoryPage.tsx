import { Filter, MoreVertical, Plus, Search } from "lucide-react";
import { ImageWithFallback } from "../../app/components/figma/ImageWithFallback";

export const WAREHOUSES = [
  { code: "B-01", name: "Bodega Principal" },
  { code: "B-02", name: "Almacén Central" },
  { code: "B-03", name: "Depósito Logístico" },
];

const INVENTORY_DATA = [
  { id: 1, ref: "HER-001", desc: "Martillo Industrial", size: "N/A", qty: 45, warehouse: "B-01", status: "activo", price: 25.5, image: "https://images.unsplash.com/photo-1586864387917-f5394726fe4c?w=400" },
  { id: 2, ref: "HER-002", desc: "Destornillador Pro", size: "M", qty: 12, warehouse: "B-01", status: "bajo stock", price: 12.0, image: "https://images.unsplash.com/photo-1530124560676-586cad3ad730?w=400" },
  { id: 3, ref: "ELE-045", desc: "Taladro Inalámbrico", size: "N/A", qty: 8, warehouse: "B-02", status: "bajo stock", price: 85.0, image: "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400" },
  { id: 4, ref: "MED-099", desc: "Cinta Métrica 5m", size: "N/A", qty: 120, warehouse: "B-03", status: "activo", price: 5.99, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400" },
];

type InventoryItem = (typeof INVENTORY_DATA)[number];

const InventoryRow = ({ item }: { item: InventoryItem }) => (
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
      <span
        className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
          item.status === "activo" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
        }`}
      >
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

export default function InventoryPage({ onAddProduct }: { onAddProduct: () => void }) {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventario</h2>
          <p className="text-gray-500">Gestione sus productos y niveles de stock.</p>
        </div>

        <button
           onClick={() => {
    console.log("CLICK agregar producto");
    onAddProduct();
  }}
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
              {WAREHOUSES.map((b) => (
                <option key={b.code} value={b.code}>
                  {b.name}
                </option>
              ))}
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
    </div>
  );
}