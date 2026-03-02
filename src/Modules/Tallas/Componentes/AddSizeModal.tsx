import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

export type SizeStatus = "Activo" | "Inactivo";
export type SizeCategory = "Ropa" | "Calzado";

export type CreateSizeInput = {
  code: string;
  name: string;
  category: SizeCategory;
  description: string;
  status: SizeStatus;
};

type Props = {
  open: boolean;
  onClose: () => void;

  // ✅ cuando guardes, le pasas el objeto creado al padre para refrescar lista
  onCreated?: (created: CreateSizeInput) => void;

  // ✅ opcional: si quieres controlar loading desde afuera
  loading?: boolean;
};

const DEFAULT_FORM: CreateSizeInput = {
  code: "",
  name: "",
  category: "Ropa",
  description: "",
  status: "Activo",
};

export function AddSizeModal({ open, onClose, onCreated, loading }: Props) {
  const [form, setForm] = useState<CreateSizeInput>(DEFAULT_FORM);
  const [saving, setSaving] = useState(false);

  const isBusy = !!loading || saving;

  const canSave = useMemo(() => {
    return form.code.trim().length > 0 && form.name.trim().length > 0;
  }, [form.code, form.name]);

  useEffect(() => {
    if (!open) return;
    // reset cada vez que abre (como modal “nuevo”)
    setForm(DEFAULT_FORM);
    setSaving(false);
  }, [open]);

  // Cierra con ESC
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
      // ✅ Por ahora “mock”: no toca backend.
      // Luego aquí metemos tu POST /tallas/create con http.ts
      await new Promise((r) => setTimeout(r, 350));

      onCreated?.({
        code: form.code.trim(),
        name: form.name.trim(),
        category: form.category,
        description: form.description.trim(),
        status: form.status,
      });

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Crear nueva talla</h3>
              <p className="text-sm text-gray-500">
                Registra una talla disponible para productos.
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

          {/* Body */}
          <div className="px-6 py-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código *
                </label>
                <input
                  value={form.code}
                  onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
                  placeholder="Ej: M, 42, N/A"
                />
              </div>

              {/* name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre *
                </label>
                <input
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900"
                  placeholder="Ej: Medium / 42"
                />
              </div>

              {/* category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, category: e.target.value as SizeCategory }))
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  <option value="Ropa">Ropa</option>
                  <option value="Calzado">Calzado</option>
                </select>
              </div>

              {/* status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, status: e.target.value as SizeStatus }))
                  }
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>

            {/* description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none min-h-[110px]"
                placeholder="Ej: Talla mediana para prendas..."
              />
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
              {isBusy ? "Guardando..." : "Guardar Talla"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}