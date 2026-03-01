import { X, Plus } from "lucide-react";
import { toast } from "sonner";

type Warehouse = { code: string; name: string };

type Props = {
  open: boolean;
  onClose: () => void;
  warehouses: Warehouse[];
};

export default function AddProductModal({ open, onClose, warehouses }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-900 text-white">
          <h3 className="text-xl font-bold">Agregar Nuevo Producto</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Referencia</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
              placeholder="REF-001"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
              placeholder="Nombre del producto"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Talla</label>
            <input
              type="text"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
              placeholder="M, L, XL..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad Inicial</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
              placeholder="0"
              min={0}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bodega</label>
            <select className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900">
              {warehouses.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Valor Unitario ($)</label>
            <input
              type="number"
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
              placeholder="0.00"
              min={0}
              step="0.01"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Imagen del Producto</label>
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center hover:border-blue-900 transition-colors cursor-pointer">
              <Plus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Haga clic para subir o arrastre una imagen</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancelar
          </button>

          <button
            onClick={() => {
              toast.success("Producto agregado correctamente");
              onClose();
            }}
            className="px-8 py-2.5 bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all"
          >
            Guardar Producto
          </button>
        </div>
      </div>
    </div>
  );
}