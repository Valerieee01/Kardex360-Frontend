import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { sizesService } from "../../../services/sizes.service";
import type { SizeItem } from "../sizes.types";

type Props = {
  open: boolean;
  onClose: () => void;
  item: SizeItem | null;
  onUpdated?: (updated: SizeItem, previousTalla: string) => void;
};

export function EditSizeModal({ open, onClose, item, onUpdated }: Props) {
  const [talla, setTalla] = useState("");
  const [saving, setSaving] = useState(false);

  const canSave = useMemo(() => talla.trim().length > 0, [talla]);

  useEffect(() => {
    if (!open || !item) return;
    setTalla(item.talla);
    setSaving(false);
  }, [open, item]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open || !item) return null;

  const handleSave = async () => {
    if (!canSave || saving) return;

    setSaving(true);
    try {
      const updated = await sizesService.update(item.talla, {
        talla: talla.trim(),
      });

      onUpdated?.(updated, item.talla);
      toast.success("Talla actualizada correctamente");
      onClose();
    } catch (error: any) {
      console.error("Error actualizando talla:", error);
      toast.error(error?.message || "No se pudo actualizar la talla");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Editar talla</h3>
              <p className="text-sm text-gray-500">
                Modifica el valor de la talla seleccionada.
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Talla *
              </label>
              <input
                value={talla}
                onChange={(e) => setTalla(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
                placeholder="Ej: S, M, 42, 65"
              />
            </div>

            {!canSave && (
              <p className="text-sm text-amber-600">
                Completa el campo <b>Talla</b> para guardar.
              </p>
            )}
          </div>

          <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={!canSave || saving}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-900 disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Actualizar Talla"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}