import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

export type WarehouseCreateInput = {
  code: string;
  name: string;
  location?: string;
  estado: boolean;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated?: (created: WarehouseCreateInput) => void;
  loading?: boolean;
};

const DEFAULT_FORM: WarehouseCreateInput = {
  code: "",
  name: "",
  location: "",
  estado: true,
};

export function AddWarehouseModal({ open, onClose, onCreated, loading }: Props) {
  const [form, setForm] = useState<WarehouseCreateInput>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const isBusy = !!loading || saving;

  const canSave = useMemo(() => {
    return form.code.trim().length > 0 && form.name.trim().length > 0;
  }, [form.code, form.name]);

  useEffect(() => {
    if (!open) return;
    setForm(DEFAULT_FORM);
    setSaving(false);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = async () => {
    if (!canSave || isBusy) return;

    setSaving(true);
    try {
      // ✅ Mock (igual que el modal de tallas). Luego aquí conectamos POST /bodegas/crear
      await new Promise((r) => setTimeout(r, 350));

      onCreated?.({
        code: form.code.trim(),
        name: form.name.trim(),
        location: form.location?.trim() || "",
        estado: form.estado,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

      {/* Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Crear nueva bodega</h3>
              <p className="text-sm text-gray-500">Registra una ubicación física para tu inventario.</p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 text-gray-500"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Código *</label>
                <input
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
                  placeholder="Ej: BOD-01"
                />
              </div>

              {/* name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nombre *</label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
                  placeholder="Ej: Principal"
                />
              </div>
            </div>

            {/* location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación</label>
              <input
                value={form.location ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
                placeholder="Ej: Barranquilla / Centro / Bodega Norte..."
              />
            </div>

            {/* estado */}
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-gray-900">Estado</p>
                <p className="text-xs text-gray-500">Define si la bodega estará activa.</p>
              </div>

              <button
                type="button"
                onClick={() => setForm((f) => ({ ...f, estado: !f.estado }))}
                className={
                  "px-3 py-2 rounded-lg text-sm font-bold transition-all " +
                  (form.estado ? "bg-emerald-600 text-white" : "bg-amber-500 text-white")
                }
              >
                {form.estado ? "Activa" : "Inactiva"}
              </button>
            </div>

            {!canSave && (
              <p className="text-sm text-amber-600">
                Completa al menos <b>Código</b> y <b>Nombre</b> para guardar.
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 border-t border-gray-100 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isBusy}
              className="px-5 py-2.5 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 disabled:opacity-50"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              disabled={!canSave || isBusy}
              className="px-6 py-2.5 rounded-xl font-bold text-white bg-blue-900 disabled:opacity-50"
            >
              {isBusy ? "Guardando..." : "Guardar Bodega"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}