import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { UserItem } from "../users.types";

export type EditUserInput = {
  identificacion: string;
  nombre_completo: string;
  role: string;
  estado: boolean;
  password: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  user: UserItem | null;
  onSave: (data: EditUserInput) => void;
};

export function EditUserModal({ open, onClose, user, onSave }: Props) {
  const [form, setForm] = useState<EditUserInput>({
    identificacion: "",
    nombre_completo: "",
    role: "ROL-VEND",
    estado: true,
    password: "",
  });

  useEffect(() => {
    if (user) {
      setForm({
        identificacion: user.identificacion,
        nombre_completo: user.name,
        role: user.role,
        estado: user.status === "Activo",
        password: "",
      });
    }
  }, [user]);

  if (!open || !user) return null;

  const handleSave = () => {
    if (!form.identificacion || !form.nombre_completo || !form.role) return;
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">Editar Usuario</h3>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-4">
            <input
              placeholder="Identificación"
              className="w-full px-4 py-3 border rounded-xl bg-gray-100"
              value={form.identificacion}
              disabled
            />

            <input
              placeholder="Nombre completo"
              className="w-full px-4 py-3 border rounded-xl"
              value={form.nombre_completo}
              onChange={(e) =>
                setForm({ ...form, nombre_completo: e.target.value })
              }
            />

            <select
              className="w-full px-4 py-3 border rounded-xl"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="ROL-ADMIN">Administrador</option>
              <option value="ROL-VEND">Vendedor</option>
            </select>

            <select
              className="w-full px-4 py-3 border rounded-xl"
              value={form.estado ? "activo" : "inactivo"}
              onChange={(e) =>
                setForm({ ...form, estado: e.target.value === "activo" })
              }
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>

            <input
              type="password"
              placeholder="Nueva contraseña (opcional)"
              className="w-full px-4 py-3 border rounded-xl"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
            />

            <p className="text-xs text-gray-500">
              Si dejas este campo vacío, la contraseña actual no se modifica.
            </p>
          </div>

          <div className="px-6 py-5 border-t flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-blue-900 text-white font-bold"
            >
              Guardar cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}