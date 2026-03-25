import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";

import type {
  CreateTransferPayload,
  InventoryTransferItem,
  SizeItem,
  Warehouse,
} from "../Traspasos.types";
import { getCurrentUserId } from "../../../../app/Shared/auth";

type Props = {
  inventory: InventoryTransferItem[];
  warehouses: Warehouse[];
  sizes: SizeItem[];
  responsable: string;
  loading?: boolean;
  onCancel: () => void;
  onSubmit: (payload: CreateTransferPayload) => Promise<void> | void;
};

export function TransferForm({
  inventory,
  warehouses,
  sizes,
  responsable,
  loading = false,
  onCancel,
  onSubmit,
}: Props) {
  const [productId, setProductId] = useState<string>("");
  const [talla, setTalla] = useState<string>("");
  const [bodegaOrigen, setBodegaOrigen] = useState<string>("");
  const [bodegaDestino, setBodegaDestino] = useState<string>("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [observacion, setObservacion] = useState<string>("");

  useEffect(() => {
    if (!bodegaOrigen && warehouses.length > 0) {
      setBodegaOrigen(warehouses[0].code);
    }
  }, [warehouses, bodegaOrigen]);

  const selectedProduct = useMemo(
    () => inventory.find((p) => String(p.id) === String(productId)),
    [inventory, productId]
  );

  const isInvalid =

    !selectedProduct ||
    !talla ||
    !bodegaOrigen ||
    !bodegaDestino ||
    bodegaOrigen === bodegaDestino ||
    cantidad <= 0;

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

  const currentUserId = getCurrentUserId();

  if (!currentUserId) {
    toast.error("No se encontró el usuario activo.");
    return;
  }

  const payload: CreateTransferPayload = {
    codigo_movimiento: generarCodigoMovimiento(),
    tipo: "TRASPASO",
    responsable: currentUserId, // ✅ AQUÍ ESTÁ LA CLAVE
    bodega_origen: bodegaOrigen,
    bodega_destino: bodegaDestino,
    observacion,
    detalle: [
      {
        referencia: selectedProduct.ref,
        talla,
        cantidad,
        valor_unitario: selectedProduct.valor_unitario,
      },
    ],
  };

  await onSubmit(payload);
};

    const currentUserId = getCurrentUserId();
  

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Responsable
          </label>
          <input
            type="text"
            value={currentUserId}
            readOnly
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none text-gray-600"
            placeholder="Usuario activo"
          />
        </div>

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
                {p.ref} - {p.desc}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Talla
          </label>
          <select
            value={talla}
            onChange={(e) => setTalla(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            disabled={loading}
          >
            <option value="">Seleccione talla</option>
            {sizes.map((size) => (
              <option key={size.value} value={size.value}>
                {size.label}
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
            min={1}
            value={Number.isNaN(cantidad) ? 0 : cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            placeholder="0"
            disabled={loading || !selectedProduct}
          />
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

        <div className="md:col-span-2">
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Precio del producto seleccionado</p>
            <p className="font-semibold text-gray-800">
              {selectedProduct
                ? `$ ${Number(selectedProduct.valor_unitario || 0).toLocaleString("es-CO")}`
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