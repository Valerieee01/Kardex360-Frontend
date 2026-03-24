import React, { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import type {
  CreateTransferPayload,
  InventoryTransferItem,
  Warehouse,
} from "../Traspasos.types";

type Props = {
  inventory: InventoryTransferItem[];
  warehouses: Warehouse[];
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: CreateTransferPayload) => Promise<void> | void;
};

export function TransferForm({
  inventory,
  warehouses,
  loading = false,
  onCancel,
  onSubmit,
}: Props) {
  const [productId, setProductId] = useState<string>("");
  const [bodegaOrigen, setBodegaOrigen] = useState<string>(warehouses[0]?.code ?? "");
  const [bodegaDestino, setBodegaDestino] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [observacion, setObservacion] = useState<string>("");

  const selectedProduct = useMemo(
    () => inventory.find((p) => p.id === productId),
    [inventory, productId]
  );

  const isInvalid =
    !productId ||
    !bodegaOrigen ||
    !bodegaDestino ||
    bodegaOrigen === bodegaDestino ||
    cantidad <= 0 ||
    !selectedProduct ||
    cantidad > selectedProduct.qty;

  const generarCodigoMovimiento = () => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const HH = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const ss = String(now.getSeconds()).padStart(2, "0");

    return `MOV-TRA-${yyyy}${MM}${dd}${HH}${mm}${ss}`;
  };

  const handleSubmit = async () => {
    if (!selectedProduct) return;

    const responsable =
      localStorage.getItem("identificacion") ||
      localStorage.getItem("userId") ||
      localStorage.getItem("id_usuario") ||
      localStorage.getItem("usuario") ||
      "";

    const payload: CreateTransferPayload = {
      codigo_movimiento: generarCodigoMovimiento(),
      tipo: "TRASPASO",
      responsable,
      bodega_origen: bodegaOrigen,
      bodega_destino: bodegaDestino,
      observacion,
      detalle: [
        {
          referencia: selectedProduct.ref,
          talla: selectedProduct.talla,
          cantidad,
          valor_unitario: selectedProduct.valor_unitario,
        },
      ],
    };

    await onSubmit(payload);
  };

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
            disabled={loading}
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
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bodega Origen
          </label>
          <select
            value={bodegaOrigen}
            onChange={(e) => setBodegaOrigen(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            disabled={loading}
          >
            <option value="">Seleccione origen</option>
            {warehouses.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden md:flex items-center justify-center pt-8">
          <ArrowLeftRight className="w-8 h-8 text-blue-900/20" />
        </div>

        <div className="hidden md:block" />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bodega Destino
          </label>
          <select
            value={bodegaDestino}
            onChange={(e) => setBodegaDestino(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            disabled={loading}
          >
            <option value="">Seleccione destino</option>
            {warehouses.map((w) => (
              <option key={w.code} value={w.code}>
                {w.name}
              </option>
            ))}
          </select>

          {bodegaOrigen && bodegaDestino && bodegaOrigen === bodegaDestino && (
            <p className="text-sm text-red-500 mt-2">
              La bodega destino debe ser diferente a la bodega origen.
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cantidad a Trasladar
          </label>
          <input
            type="number"
            min={1}
            value={Number.isNaN(cantidad) ? 0 : cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            placeholder="0"
            disabled={loading}
          />
          {selectedProduct && cantidad > selectedProduct.qty && (
            <p className="text-sm text-red-500 mt-2">
              La cantidad supera el stock disponible ({selectedProduct.qty}).
            </p>
          )}
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Talla</p>
            <p className="font-semibold text-gray-800">
              {selectedProduct?.talla || "-"}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Valor unitario</p>
            <p className="font-semibold text-gray-800">
              {selectedProduct?.valor_unitario
                ? `$ ${selectedProduct.valor_unitario.toLocaleString("es-CO")}`
                : "-"}
            </p>
          </div>
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
            disabled={loading}
          />
        </div>
      </div>

      <div className="mt-8 flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading || isInvalid}
          className="px-8 py-3 bg-blue-900 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
        >
          {loading ? "Procesando..." : "Ejecutar Traspaso"}
        </button>
      </div>
    </div>
  );
}