import React, { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import type {
  CreateMovementPayload,
  InventoryItem,
  MovementApiItem,
  MovementDetailForm,
  MovementType,
  Warehouse,
} from "../ventas.types";
import type { SizeItem } from "../../../Tallas/sizes.types";

type Props = {
  inventory: InventoryItem[];
  warehouses: Warehouse[];
  sizes: SizeItem[];
  currentUserId: string;
  editingMovement: MovementApiItem | null;
  onSubmit: (payload: CreateMovementPayload, editingCode?: string) => Promise<void>;
  onCancelEdit: () => void;
};

const createEmptyDetail = (): MovementDetailForm => ({
  id: crypto.randomUUID(),
  referencia: "",
  talla: "",
  cantidad: 1,
  valor_unitario: 0,
});

const buildCodeByType = (tipo: MovementType) => {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(
    now.getDate()
  ).padStart(2, "0")}${String(now.getHours()).padStart(2, "0")}${String(
    now.getMinutes()
  ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;

  return tipo === "VENTA" ? `MOV-VEN-${stamp}` : `MOV-ENT-${stamp}`;
};

export function SalesForm({
  inventory,
  warehouses,
  sizes,
  currentUserId,
  editingMovement,
  onSubmit,
  onCancelEdit,
}: Props) {
  const [codigoMovimiento, setCodigoMovimiento] = useState(buildCodeByType("VENTA"));
  const [tipo, setTipo] = useState<"VENTA" | "ENTRADA">("VENTA");
  const [responsable, setResponsable] = useState(currentUserId);
  const [bodegaOrigen, setBodegaOrigen] = useState<string>(warehouses[0]?.code ?? "");
  const [bodegaDestino, setBodegaDestino] = useState<string>(warehouses[0]?.code ?? "");
  const [observacion, setObservacion] = useState("");
  const [detalle, setDetalle] = useState<MovementDetailForm[]>([createEmptyDetail()]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setResponsable(currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    if (!editingMovement) return;

    setCodigoMovimiento(editingMovement.codigo_movimiento);
    setTipo(editingMovement.tipo === "ENTRADA" ? "ENTRADA" : "VENTA");
    setResponsable(currentUserId);
    setBodegaOrigen(editingMovement.bodega_origen ?? "");
    setBodegaDestino(editingMovement.bodega_destino ?? "");
    setObservacion(editingMovement.observacion ?? "");
    setDetalle(
      editingMovement.movimiento_detalle?.length
        ? editingMovement.movimiento_detalle.map((d) => ({
            id: crypto.randomUUID(),
            referencia: d.referencia,
            talla: d.talla,
            cantidad: Number(d.cantidad),
            valor_unitario: Number(d.valor_unitario),
          }))
        : [createEmptyDetail()]
    );
  }, [editingMovement, currentUserId]);

  useEffect(() => {
    if (editingMovement) return;
    setCodigoMovimiento(buildCodeByType(tipo));
  }, [tipo, editingMovement]);

  const grandTotal = useMemo(() => {
    return detalle.reduce((acc, item) => acc + item.cantidad * item.valor_unitario, 0);
  }, [detalle]);

  const handleAddRow = () => {
    setDetalle((prev) => [...prev, createEmptyDetail()]);
  };

  const handleRemoveRow = (id: string) => {
    setDetalle((prev) => (prev.length === 1 ? prev : prev.filter((item) => item.id !== id)));
  };

  const updateRow = (
    id: string,
    field: keyof MovementDetailForm,
    value: string | number
  ) => {
    setDetalle((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const validate = () => {
    if (!codigoMovimiento.trim()) return "El código del movimiento es obligatorio.";
    if (!tipo) return "Debe seleccionar el tipo de movimiento.";
    if (!responsable.trim()) return "El responsable es obligatorio.";

    if (tipo === "VENTA" && !bodegaOrigen) {
      return "Para una venta, la bodega origen es obligatoria.";
    }

    if (tipo === "ENTRADA" && !bodegaDestino) {
      return "Para una entrada, la bodega destino es obligatoria.";
    }

    if (!detalle.length) return "Debe agregar al menos un producto.";

    for (let i = 0; i < detalle.length; i++) {
      const item = detalle[i];
      if (!item.referencia) return `La referencia de la fila ${i + 1} es obligatoria.`;
      if (!item.talla.trim()) return `La talla de la fila ${i + 1} es obligatoria.`;
      if (!item.cantidad || item.cantidad <= 0) return `La cantidad de la fila ${i + 1} debe ser mayor a 0.`;
      if (item.valor_unitario < 0) return `El valor unitario de la fila ${i + 1} no puede ser negativo.`;
    }

    return null;
  };

  const resetForm = () => {
    setTipo("VENTA");
    setCodigoMovimiento(buildCodeByType("VENTA"));
    setResponsable(currentUserId);
    setBodegaOrigen(warehouses[0]?.code ?? "");
    setBodegaDestino(warehouses[0]?.code ?? "");
    setObservacion("");
    setDetalle([createEmptyDetail()]);
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) {
      alert(error);
      return;
    }

    const payload: CreateMovementPayload = {
      codigo_movimiento: codigoMovimiento.trim(),
      tipo,
      responsable: responsable.trim(),
      bodega_origen: tipo === "VENTA" ? bodegaOrigen : null,
      bodega_destino: tipo === "ENTRADA" ? bodegaDestino : null,
      observacion: observacion.trim(),
      detalle: detalle.map((d) => ({
        referencia: d.referencia,
        talla: d.talla.trim(),
        cantidad: Number(d.cantidad),
        valor_unitario: Number(d.valor_unitario),
      })),
    };

    try {
      setLoading(true);
      await onSubmit(payload, editingMovement?.codigo_movimiento);
      if (!editingMovement) {
        resetForm();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            {editingMovement ? "Editar Movimiento" : "Nuevo Movimiento"}
          </h3>
          <p className="text-sm text-gray-500">
            Registra ventas o entradas con múltiples productos.
          </p>
        </div>

        {editingMovement && (
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancelar edición
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Código movimiento</label>
          <input
            value={codigoMovimiento}
            onChange={(e) => setCodigoMovimiento(e.target.value)}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            placeholder="MOV-..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as "VENTA" | "ENTRADA")}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            disabled={!!editingMovement}
          >
            <option value="VENTA">VENTA</option>
            <option value="ENTRADA">ENTRADA</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Responsable</label>
          <input
            value={responsable}
            readOnly
            className="w-full px-4 py-3.5 bg-gray-100 border border-gray-200 rounded-xl outline-none text-gray-600 cursor-not-allowed"
            placeholder="Usuario autenticado"
          />
        </div>

        {tipo === "VENTA" ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bodega origen</label>
            <select
              value={bodegaOrigen}
              onChange={(e) => setBodegaOrigen(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            >
              <option value="">Seleccione</option>
              {warehouses.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code} - {w.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Bodega destino</label>
            <select
              value={bodegaDestino}
              onChange={(e) => setBodegaDestino(e.target.value)}
              className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none"
            >
              <option value="">Seleccione</option>
              {warehouses.map((w) => (
                <option key={w.code} value={w.code}>
                  {w.code} - {w.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="xl:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Observación</label>
          <textarea
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none min-h-[100px]"
            placeholder="Observación del movimiento"
          />
        </div>
      </div>

      <div className="border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-gray-900">Detalle de productos</h4>
            <p className="text-sm text-gray-500">Agrega una o varias referencias al movimiento.</p>
          </div>

          <button
            onClick={handleAddRow}
            type="button"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 text-white hover:bg-blue-800"
          >
            <Plus size={16} />
            Agregar referencia
          </button>
        </div>

        <div className="p-5 space-y-5 bg-white">
          {detalle.map((item, index) => {
            const rowTotal = item.cantidad * item.valor_unitario;

            return (
              <div
                key={item.id}
                className="border border-gray-200 rounded-2xl p-5 bg-gray-50/40 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-semibold text-gray-900">Referencia #{index + 1}</h5>
                    <p className="text-xs text-gray-500">Completa los datos del producto.</p>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveRow(item.id)}
                    className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
                    title="Eliminar fila"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-6 gap-4">
                  <div className="2xl:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Producto / Referencia
                    </label>
                    <select
                      value={item.referencia}
                      onChange={(e) => updateRow(item.id, "referencia", e.target.value)}
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none"
                    >
                      <option value="">Seleccione un producto</option>
                      {inventory.map((p) => (
                        <option key={p.id} value={p.ref}>
                          {p.ref} - {p.desc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Talla</label>
                    <select
                      value={item.talla}
                      onChange={(e) => updateRow(item.id, "talla", e.target.value)}
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none"
                      disabled={sizes.length === 0}
                    >
                      <option value="">
                        {sizes.length === 0 ? "No hay tallas disponibles" : "Seleccione una talla"}
                      </option>
                      {sizes.map((size) => (
                        <option key={size.id} value={size.talla}>
                          {size.talla}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                    <input
                      type="number"
                      min={1}
                      value={Number.isNaN(item.cantidad) ? 1 : item.cantidad}
                      onChange={(e) => updateRow(item.id, "cantidad", Number(e.target.value))}
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valor unitario</label>
                    <input
                      type="number"
                      min={0}
                      value={Number.isNaN(item.valor_unitario) ? 0 : item.valor_unitario}
                      onChange={(e) => updateRow(item.id, "valor_unitario", Number(e.target.value))}
                      className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-xl outline-none"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Total</label>
                    <div className="w-full px-4 py-3.5 bg-gray-100 border border-gray-200 rounded-xl text-sm font-semibold text-gray-800 min-h-[50px] flex items-center">
                      ${rowTotal.toLocaleString("es-CO")}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <span className="text-sm text-gray-500">Total general del movimiento</span>
          <span className="text-xl font-bold text-gray-900">
            ${grandTotal.toLocaleString("es-CO")}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-60 text-white font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
        >
          {editingMovement ? <Pencil size={18} /> : null}
          {loading
            ? "Guardando..."
            : editingMovement
            ? "Actualizar movimiento"
            : tipo === "VENTA"
            ? "Confirmar venta"
            : "Confirmar entrada"}
        </button>
      </div>
    </div>
  );
}