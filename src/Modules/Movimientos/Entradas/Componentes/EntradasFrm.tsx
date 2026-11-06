import { useEffect, useState } from "react";
import { Pencil, RotateCcw } from "lucide-react";
import type {
  CreateMovementPayload,
  InventoryItem,
  MovementApiItem,
  ProductGroup,
  Warehouse,
} from "../../Ventas/ventas.types";
import type { SizeItem } from "../../../Tallas/sizes.types";
import { ProductGroupsEditor } from "../../Componentes/ProductGroupsEditor";
import { buildProductGroups, createEmptyGroup, flattenGroups } from "../../movimientos.utils";

type Props = {
  inventory: InventoryItem[];
  warehouses: Warehouse[];
  sizes: SizeItem[];
  currentUserId: string;
  editingMovement: MovementApiItem | null;
  isCorrection?: boolean;
  originalCode?: string;
  onSubmit: (payload: CreateMovementPayload, editingCode?: string) => Promise<void>;
  onCancelEdit: () => void;
};

const buildEntradaCode = () => {
  const now = new Date();
  const s = (n: number, p = 2) => String(n).padStart(p, "0");
  return `MOV-ENT-${now.getFullYear()}${s(now.getMonth() + 1)}${s(now.getDate())}${s(now.getHours())}${s(now.getMinutes())}${s(now.getSeconds())}`;
};

export function EntradasForm({
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
  const [codigoMovimiento, setCodigoMovimiento] = useState(buildEntradaCode());
  const [bodegaDestino, setBodegaDestino] = useState(warehouses[0]?.code ?? "");
  const [observacion, setObservacion] = useState("");
  const [groups, setGroups] = useState<ProductGroup[]>([createEmptyGroup()]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!editingMovement) {
      setCodigoMovimiento(buildEntradaCode());
      return;
    }
    setCodigoMovimiento(editingMovement.codigo_movimiento);
    setBodegaDestino(editingMovement.bodega_destino ?? "");
    setObservacion(editingMovement.observacion ?? "");
    setGroups(buildProductGroups(editingMovement.movimiento_detalle));
  }, [editingMovement]);

  const validate = (): string | null => {
    if (!codigoMovimiento.trim()) return "El código es obligatorio.";
    if (!bodegaDestino) return "La bodega destino es obligatoria.";
    for (let i = 0; i < groups.length; i++) {
      const g = groups[i];
      if (!g.referencia) return `Referencia #${i + 1}: selecciona un producto.`;
      if (g.valor_unitario < 0) return `Referencia #${i + 1}: valor unitario inválido.`;
      for (let j = 0; j < g.tallas.length; j++) {
        const t = g.tallas[j];
        if (!t.talla) return `Referencia #${i + 1} · talla ${j + 1}: selecciona una talla.`;
        if (!t.cantidad || t.cantidad <= 0) return `Referencia #${i + 1} · talla ${j + 1}: la cantidad debe ser mayor a 0.`;
      }
    }
    return null;
  };

  const resetForm = () => {
    setCodigoMovimiento(buildEntradaCode());
    setBodegaDestino(warehouses[0]?.code ?? "");
    setObservacion("");
    setGroups([createEmptyGroup()]);
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) { alert(error); return; }

    const payload: CreateMovementPayload = {
      codigo_movimiento: codigoMovimiento.trim(),
      tipo: "ENTRADA",
      responsable: currentUserId,
      bodega_origen: null,
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
            {isCorrection ? "Corrección de Entrada" : editingMovement ? "Editar Entrada" : "Nueva Entrada de Stock"}
          </h3>
          <p className="text-sm text-gray-500">
            Registra entradas con múltiples referencias y tallas por producto.
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
            placeholder="MOV-ENT-..."
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
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Bodega destino</label>
          <select
            value={bodegaDestino}
            onChange={(e) => setBodegaDestino(e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
          >
            <option value="">Seleccione bodega</option>
            {warehouses.map((w) => (
              <option key={w.code} value={w.code}>{w.code} — {w.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Observación</label>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm resize-none"
            placeholder="Observación opcional"
          />
        </div>
      </div>

      {/* Editor de grupos */}
      <ProductGroupsEditor
        groups={groups}
        onChange={setGroups}
        inventory={inventory}
        sizes={sizes}
      />

      {/* Botón submit */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2"
      >
        {isCorrection ? <RotateCcw size={18} /> : editingMovement ? <Pencil size={18} /> : null}
        {loading ? "Guardando..." : isCorrection ? "Confirmar corrección" : "Confirmar entrada de stock"}
      </button>
    </div>
  );
}
