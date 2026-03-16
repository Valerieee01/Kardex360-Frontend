import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Package, Plus } from "lucide-react";
import type { SettingsForm } from "./Configuaton.types";

const DEFAULT_SETTINGS: SettingsForm = {
  nit: "900.123.456-7",
  nombreSistema: "Kardex Pro Solutions S.A.",
  ubicacion: "Calle 100 #15-30, Bogotá, Colombia",
  emailSoporte: "soporte@kardexpro.com",
};

export function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(DEFAULT_SETTINGS);
  const [initial, setInitial] = useState<SettingsForm>(DEFAULT_SETTINGS);

  useEffect(() => {
    // ✅ Luego: aquí haces GET /configuracion y setForm/setInitial
    // Por ahora queda mock con DEFAULT_SETTINGS
  }, []);

  const onReset = () => {
    setForm(initial);
    toast("Cambios restablecidos");
  };

  const onSave = () => {
    // ✅ Luego: aquí haces PUT /configuracion
    toast.success("Configuración guardada");
    setInitial(form);
    console.log("Guardar config:", form);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Configuración del Sistema</h2>
        <p className="text-gray-500">Datos generales y parámetros administrativos.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        {/* Logo / Imagen */}
        <div className="flex justify-center mb-8">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300 overflow-hidden group-hover:border-blue-900 transition-colors">
              <Package className="w-10 h-10 text-gray-300 group-hover:text-blue-900" />
            </div>
            <button
              type="button"
              onClick={() => toast("Subir logo (pendiente)")}
              className="absolute -bottom-2 -right-2 p-2 bg-blue-900 text-white rounded-lg shadow-lg"
              aria-label="Subir logo"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NIT / Identificación Empresa
            </label>
            <input
              type="text"
              value={form.nit}
              onChange={(e) => setForm((f) => ({ ...f, nit: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              placeholder="900.123.456-7"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Sistema / Razón Social
            </label>
            <input
              type="text"
              value={form.nombreSistema}
              onChange={(e) => setForm((f) => ({ ...f, nombreSistema: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              placeholder="Kardex Pro..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación Principal
            </label>
            <input
              type="text"
              value={form.ubicacion}
              onChange={(e) => setForm((f) => ({ ...f, ubicacion: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              placeholder="Dirección..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email de Soporte
            </label>
            <input
              type="email"
              value={form.emailSoporte}
              onChange={(e) => setForm((f) => ({ ...f, emailSoporte: e.target.value }))}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              placeholder="soporte@..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl"
          >
            Restablecer
          </button>

          <button
            type="button"
            onClick={onSave}
            className="px-6 py-2.5 bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/10"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}