import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Package, Plus } from "lucide-react";
import type { SettingsForm } from "./Configuaton.types";
import {
  getConfiguracion,
  crearConfiguracion,
  actualizarConfiguracion,
  normalizeIdentificacion,
} from "../../services/configuration.service";

const DEFAULT_SETTINGS: SettingsForm = {
  nit: "",
  nombreSistema: "",
  ubicacion: "",
};

export function SettingsPage() {
  const [form, setForm] = useState<SettingsForm>(DEFAULT_SETTINGS);
  const [initial, setInitial] = useState<SettingsForm>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadConfiguracion();
  }, []);

  const loadConfiguracion = async () => {
  try {
    setLoading(true);

    const response = await getConfiguracion();
    console.log("CONFIG RESPONSE:", response);

    const config = response?.data?.[0];

    if (!config) {
      setForm(DEFAULT_SETTINGS);
      setInitial(DEFAULT_SETTINGS);
      return;
    }

    const mapped: SettingsForm = {
      nit: config.identificacion ?? "",
      nombreSistema: config.nombre_sistema ?? "",
      ubicacion: config.ubicacion ?? "",
    };

    setForm(mapped);
    setInitial(mapped);
  } catch (error) {
    console.error("Error cargando configuración:", error);
    toast.error("No se pudo cargar la configuración");
  } finally {
    setLoading(false);
  }
};

  const onReset = () => {
    setForm(initial);
    toast("Cambios restablecidos");
  };

  const onSave = async () => {
    try {
      setLoading(true);

      const identificacionActual = normalizeIdentificacion(form.nit);
      const identificacionInicial = normalizeIdentificacion(initial.nit);

      if (!identificacionActual) {
        toast.error("La identificación es obligatoria");
        return;
      }

      if (!form.nombreSistema.trim()) {
        toast.error("El nombre del sistema es obligatorio");
        return;
      }

      if (!form.ubicacion.trim()) {
        toast.error("La ubicación es obligatoria");
        return;
      }

      const payload = {
        identificacion: identificacionActual,
        nombre_sistema: form.nombreSistema.trim(),
        ubicacion: form.ubicacion.trim(),
      };

      if (!identificacionInicial) {
        await crearConfiguracion(payload);
        toast.success("Configuración creada correctamente");
      } else if (identificacionActual !== identificacionInicial) {
        await crearConfiguracion(payload);
        toast.success("Nueva configuración creada correctamente");
      } else {
        await actualizarConfiguracion(identificacionInicial, {
          nombre_sistema: payload.nombre_sistema,
          ubicacion: payload.ubicacion,
        });
        toast.success("Configuración actualizada correctamente");
      }

      await loadConfiguracion();
    } catch (error: any) {
      console.error("Error guardando configuración:", error);
      toast.error(error?.message || "No se pudo guardar la configuración");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">
          Configuración del Sistema
        </h2>
        <p className="text-gray-500">
          Datos generales y parámetros administrativos.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
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
              placeholder="900123456"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Sistema / Razón Social
            </label>
            <input
              type="text"
              value={form.nombreSistema}
              onChange={(e) =>
                setForm((f) => ({ ...f, nombreSistema: e.target.value }))
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              placeholder="Kardex Syscom"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ubicación Principal
            </label>
            <input
              type="text"
              value={form.ubicacion}
              onChange={(e) =>
                setForm((f) => ({ ...f, ubicacion: e.target.value }))
              }
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              placeholder="Barranquilla - Colombia"
              disabled={loading}
            />
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
          <button
            type="button"
            onClick={onReset}
            className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl"
            disabled={loading}
          >
            Restablecer
          </button>

          <button
            type="button"
            onClick={onSave}
            className="px-6 py-2.5 bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/10 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </div>
    </div>
  );
}