import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Pencil, RotateCcw } from "lucide-react";
import type { CreateMovementPayload, MovementApiItem, ProductGroup } from "../../Ventas/ventas.types";
import type { SizeItem } from "../../../Tallas/sizes.types";
import type { InventoryTransferItem, Warehouse } from "../Traspasos.types";
import { ProductGroupsEditor } from "../../Componentes/ProductGroupsEditor";
import { buildProductGroups, createEmptyGroup, flattenGroups } from "../../movimientos.utils";

type Props = {
  inventory: InventoryTransferItem[];
  warehouses: Warehouse[];
  sizes: SizeItem[];
  currentUserId: string;
  editingMovement: MovementApiItem | null;
  isCorrection?: boolean;
  originalCode?: string;
  onSubmit: (payload: CreateMovementPayload, editingCode?: string) => Promise<void>;
  onCancelEdit: () => void;
};

const buildTraspasoCode = () => {
  const now = new Date();
  const s = (n: number, p = 2) => String(n).padStart(p, "0");
  return `MOV-TRA-${now.getFullYear()}${s(now.getMonth() + 1)}${s(now.getDate())}${s(now.getHours())}${s(now.getMinutes())}${s(now.getSeconds())}`;
};

export function TraspasosForm({
  inventory,
  warehouses,
  sizes,
  currentUserId,
  editingMovement,
  isCorrection = false,
  originalCode,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [codigoMovimiento, setCodigoMovimiento] = useState(buildTraspasoCode());
  const [bodegaOrigen, setBodegaOrigen] = useState(warehouses[0]?.code ?? "");
  const [bodegaDestino, setBodegaDestino] = useState(warehouses[1]?.code ?? "");
  const [observacion, setObservacion] = useState("");
  const [groups, setGroups] = useState<ProductGroup[]>([createEmptyGroup()]);
  const [loading, setLoading] = useState(false);

  // Map InventoryTransferItem to FormProductItem shape (valor_unitario → precio_base)
  const formInventory = useMemo(
    () => inventory.map((p) => ({ id: p.id, ref: p.ref, desc: p.desc, precio_base: p.valor_unitario })),
    [inventory]
  );

  useEffect(() => {
    if (!editingMovement) {
      setCodigoMovimiento(buildTraspasoCode());
      return;
    }
    setCodigoMovimiento(editingMovement.codigo_movimiento);
    setBodegaOrigen(editingMovement.bodega_origen ?? "");
    setBodegaDestino(editingMovement.bodega_destino ?? "");
    setObservacion(editingMovement.observacion ?? "");
    setGroups(buildProductGroups(editingMovement.movimiento_detalle));
  }, [editingMovement]);

  const validate = (): string | null => {
    if (!codigoMovimiento.trim()) return "El código es obligatorio.";
    if (!bodegaOrigen) return "La bodega origen es obligatoria.";
    if (!bodegaDestino) return "La bodega destino es obligatoria.";
    if (bodegaOrigen === bodegaDestino) return "La bodega origen y destino deben ser diferentes.";
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      if (!g.referencia) return `Referencia #${i + 1}: selecciona un producto.`;
      for (let j = 0; j < g.tallas.length; j++) {
        const t = g.tallas[j];
        if (!t.talla) return `Referencia #${i + 1} · talla ${j + 1}: selecciona una talla.`;
        if (!t.cantidad || t.cantidad <= 0) return `Referencia #${i + 1} · talla ${j + 1}: la cantidad debe ser mayor a 0.`;
      }
    }
    return null;
  };

  const resetForm = () => {
    setCodigoMovimiento(buildTraspasoCode());
    setBodegaOrigen(warehouses[0]?.code ?? "");
    setBodegaDestino(warehouses[1]?.code ?? "");
    setObservacion("");
    setGroups([createEmptyGroup()]);
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) { alert(error); return; }

    const payload: CreateMovementPayload = {
      codigo_movimiento: codigoMovimiento.trim(),
      tipo: "TRASPASO",
      responsable: currentUserId,
      bodega_origen: bodegaOrigen,
      bodega_destino: bodegaDestino,
      observacion: observacion.trim(),
      detalle: flattenGroups(groups),
    };

    try {
      setLoading(true);
      await onSubmit(payload);
      if (!editingMovement && !isCorrection) resetForm();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {isCorrection ? "Corrección de Traspaso" : editingMovement ? "Editar Traspaso" : "Nuevo Traspaso"}
          </h3>
          <p className="text-sm text-gray-500">
            Mueve stock entre bodegas con múltiples referencias y tallas por producto.
          </p>
        </div>
        {(editingMovement || isCorrection) && (
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 text-sm"
          >
            Cancelar
          </button>
        )}
      </div>

      {isCorrection && originalCode && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <RotateCcw className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Modo corrección</p>
            <p className="text-xs text-amber-700 mt-0.5">
              El movimiento <span className="font-mono font-bold">{originalCode}</span> fue anulado.
              Corrige los datos necesarios y confirma para crear el nuevo movimiento.
            </p>
          </div>
        </div>
      )}

      {/* Campos generales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Código movimiento</label>
          <input
            value={codigoMovimiento}
            onChange={(e) => setCodigoMovimiento(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
            placeholder="MOV-TRA-..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Responsable</label>
          <input
            value={currentUserId}
            readOnly
            className="w-full px-4 py-3 bg-gray-100 border border-gray-200 rounded-xl outline-none text-gray-600 cursor-not-allowed text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bodega origen</label>
          <select
            value={bodegaOrigen}
            onChange={(e) => setBodegaOrigen(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
          >
            <option value="">Seleccione origen</option>
            {warehouses.map((w) => (
              <option key={w.code} value={w.code}>{w.code} — {w.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            <span className="inline-flex items-center gap-1.5">
              <ArrowLeftRight size={14} className="text-blue-900" />
              Bodega destino
            </span>
          </label>
          <select
            value={bodegaDestino}
            onChange={(e) => setBodegaDestino(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
          >
            <option value="">Seleccione destino</option>
            {warehouses.map((w) => (
              <option key={w.code} value={w.code}>{w.code} — {w.name}</option>
            ))}
          </select>
          {bodegaOrigen && bodegaDestino && bodegaOrigen === bodegaDestino && (
            <p className="text-xs text-red-500 mt-1.5">
              La bodega destino debe ser diferente a la de origen.
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Observaciones / Motivo</label>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm resize-none"
            placeholder="Ej: Reabastecimiento de sucursal centro..."
          />
        </div>
      </div>

      {/* Editor de grupos */}
      <ProductGroupsEditor
        groups={groups}
        onChange={setGroups}
        inventory={formInventory}
        sizes={sizes}
      />

      {/* Botón submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 bg-blue-900 hover:bg-blue-800 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2"
      >
        {isCorrection ? <RotateCcw size={18} /> : editingMovement ? <Pencil size={18} /> : null}
        {loading ? "Procesando..." : isCorrection ? "Confirmar corrección" : "Ejecutar traspaso"}
      </button>
    </div>
  );
}
