import { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import type { ProductFormValues } from "./inventory.types";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormValues) => Promise<void>;
  initialValues?: ProductFormValues | null;
  title?: string;
  submitText?: string;
  disableReference?: boolean;
  existingReferences?: string[];
  originalReference?: string | null;
};

type FormErrors = Partial<Record<keyof ProductFormValues, string>>;

const initialState: ProductFormValues = {
  referencia: "",
  descripcion: "",
  imagen_url: "",
  precio_base: "",
  estado: true,
};

function isValidUrl(value: string) {
  try {
    new URL(value);
    return true;
  } catch {
    return false;
  }
}

export default function AddProductModal({
  open,
  onClose,
  onSubmit,
  initialValues,
  title = "Agregar Nuevo Producto",
  submitText = "Guardar Producto",
  disableReference = false,
  existingReferences = [],
  originalReference = null,
}: Props) {
  const [form, setForm] = useState<ProductFormValues>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initialValues ?? initialState);
      setErrors({});
    }
  }, [initialValues, open]);

  const normalizedReferences = useMemo(
    () => existingReferences.map((r) => r.trim().toLowerCase()),
    [existingReferences]
  );

  if (!open) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        name === "precio_base"
          ? value === ""
            ? ""
            : Number(value)
          : name === "estado"
          ? value === "true"
          : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    const referencia = form.referencia.trim();
    const descripcion = form.descripcion.trim();
    const imagen = form.imagen_url.trim();

    if (!referencia) {
      newErrors.referencia = "La referencia es obligatoria";
    } else {
      const repeated = normalizedReferences.includes(referencia.toLowerCase());
      const isSameOriginal =
        originalReference &&
        referencia.toLowerCase() === originalReference.trim().toLowerCase();

      if (repeated && !isSameOriginal) {
        newErrors.referencia = "Ya existe un producto con esa referencia";
      }
    }

    if (!descripcion) {
      newErrors.descripcion = "La descripción es obligatoria";
    }

    if (form.precio_base === "" || form.precio_base === null || form.precio_base === undefined) {
      newErrors.precio_base = "El precio base es obligatorio";
    } else if (Number(form.precio_base) < 0) {
      newErrors.precio_base = "El precio base no puede ser negativo";
    }

    if (!imagen) {
      newErrors.imagen_url = "La imagen es obligatoria";
    } else if (!isValidUrl(imagen)) {
      newErrors.imagen_url = "Debe ser una URL válida";
    }

    if (typeof form.estado !== "boolean") {
      newErrors.estado = "El estado es obligatorio";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Revisa los campos obligatorios");
      return;
    }

    try {
      setLoading(true);

      await onSubmit({
        referencia: form.referencia.trim(),
        descripcion: form.descripcion.trim(),
        imagen_url: form.imagen_url.trim(),
        precio_base: Number(form.precio_base),
        estado: form.estado,
      });

      onClose();
    } catch (error) {
      console.error(error);
      toast.error("No fue posible guardar el producto");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field?: string) =>
    `w-full px-4 py-2.5 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 ${
      field ? "border-red-400" : "border-gray-200"
    }`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-blue-900 text-white">
          <h3 className="text-xl font-bold">{title}</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg"
            aria-label="Cerrar modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Referencia <span className="text-red-500">*</span>
            </label>
            <input
              name="referencia"
              type="text"
              value={form.referencia}
              onChange={handleChange}
              disabled={disableReference}
              className={`${inputClass(errors.referencia)} disabled:bg-gray-100`}
              placeholder="REF-001"
            />
            {errors.referencia && (
              <p className="mt-1 text-sm text-red-600">{errors.referencia}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Precio Base <span className="text-red-500">*</span>
            </label>
            <input
              name="precio_base"
              type="number"
              value={form.precio_base}
              onChange={handleChange}
              min={0}
              step="0.01"
              className={inputClass(errors.precio_base)}
              placeholder="0"
            />
            {errors.precio_base && (
              <p className="mt-1 text-sm text-red-600">{errors.precio_base}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción <span className="text-red-500">*</span>
            </label>
            <textarea
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              rows={3}
              className={inputClass(errors.descripcion)}
              placeholder="Descripción del producto"
            />
            {errors.descripcion && (
              <p className="mt-1 text-sm text-red-600">{errors.descripcion}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL de Imagen <span className="text-red-500">*</span>
            </label>
            <input
              name="imagen_url"
              type="text"
              value={form.imagen_url}
              onChange={handleChange}
              className={inputClass(errors.imagen_url)}
              placeholder="https://misitio.com/imagen.png"
            />
            {errors.imagen_url && (
              <p className="mt-1 text-sm text-red-600">{errors.imagen_url}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado <span className="text-red-500">*</span>
            </label>
            <select
              name="estado"
              value={String(form.estado)}
              onChange={handleChange}
              className={inputClass(errors.estado)}
            >
              <option value="true">Activo</option>
              <option value="false">Inactivo</option>
            </select>
            {errors.estado && (
              <p className="mt-1 text-sm text-red-600">{errors.estado}</p>
            )}
          </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-all"
          >
            Cancelar
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2.5 bg-blue-900 text-white font-bold rounded-xl shadow-lg shadow-blue-900/10 hover:bg-blue-800 transition-all disabled:opacity-60"
          >
            {loading ? "Guardando..." : submitText}
          </button>
        </div>
      </div>
    </div>
  );
}