import React, { useState } from "react";
import type { InventoryItem, Warehouse } from "../ventas.types";

type Props = {
  inventory: InventoryItem[];
  warehouses: Warehouse[];
  onConfirm: () => void;
};

export function SalesForm({ inventory, warehouses, onConfirm }: Props) {
  const [productId, setProductId] = useState<string>("");
  const [talla, setTalla] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [bodegaOrigen, setBodegaOrigen] = useState<string>(warehouses[0]?.code ?? "");
  const [precioUnitario, setPrecioUnitario] = useState<number>(0);

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Producto / Referencia
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all"
          >
            <option value="">Seleccione un producto</option>
            {inventory.map((p) => (
              <option key={p.id} value={p.id}>
                {p.ref} - {p.desc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Talla</label>
          <input
            value={talla}
            onChange={(e) => setTalla(e.target.value)}
            type="text"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            placeholder="Ej: M, 42, N/A"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
          <input
            value={Number.isNaN(cantidad) ? 0 : cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            type="number"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            placeholder="0"
            min={0}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bodega Origen</label>
          <select
            value={bodegaOrigen}
            onChange={(e) => setBodegaOrigen(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
          >
            {warehouses.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio Unitario ($)
          </label>
          <input
            value={Number.isNaN(precioUnitario) ? 0 : precioUnitario}
            onChange={(e) => setPrecioUnitario(Number(e.target.value))}
            type="number"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            placeholder="0.00"
            min={0}
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          onClick={onConfirm}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20"
        >
          Confirmar Venta y Descontar Stock
        </button>
      </div>
    </div>
  );
}