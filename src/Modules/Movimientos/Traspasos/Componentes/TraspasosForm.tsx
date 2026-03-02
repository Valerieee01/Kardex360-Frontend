import React, { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import type { InventoryTransferItem, Warehouse } from "../Traspasos.types";

type Props = {
  inventory: InventoryTransferItem[];
  warehouses: Warehouse[];
  onCancel: () => void;
  onSubmit: () => void;
};

export function TransferForm({ inventory, warehouses, onCancel, onSubmit }: Props) {
  const [productId, setProductId] = useState<string>("");
  const [bodegaOrigen, setBodegaOrigen] = useState<string>(warehouses[0]?.code ?? "");
  const [bodegaDestino, setBodegaDestino] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [observacion, setObservacion] = useState<string>("");

  const selectedProduct = useMemo(
    () => inventory.find((p) => p.id === productId),
    [inventory, productId]
  );

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Seleccionar Producto
          </label>
          <select
            value={productId}
            onChange={(e) => setProductId(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
          >
            <option value="">Elija el producto a traspasar</option>
            {inventory.map((p) => (
              <option key={p.id} value={p.id}>
                {p.ref} - {p.desc} (Stock: {p.qty})
              </option>
            ))}
          </select>
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

        {/* Ícono en medio (solo en md+) */}
        <div className="hidden md:flex items-center justify-center pt-8">
          <ArrowLeftRight className="w-8 h-8 text-blue-900/20" />
        </div>

        {/* Spacer para respetar tu layout */}
        <div className="hidden md:block" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bodega Destino</label>
          <select
            value={bodegaDestino}
            onChange={(e) => setBodegaDestino(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
          >
            <option value="">Seleccione destino</option>
            {warehouses.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad a Trasladar
          </label>
          <input
            type="number"
            min={0}
            value={Number.isNaN(cantidad) ? 0 : cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            placeholder="0"
          />
          {selectedProduct && cantidad > selectedProduct.qty && (
            <p className="text-sm text-red-500 mt-2">
              La cantidad supera el stock disponible ({selectedProduct.qty}).
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Observaciones / Motivo
          </label>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none min-h-[100px]"
            placeholder="Ej: Reabastecimiento de sucursal centro..."
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={onSubmit}
          className="px-8 py-3 bg-blue-900 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20"
        >
          Ejecutar Traspaso
        </button>
      </div>
    </div>
  );
}