import { useState } from "react";
import { X } from "lucide-react";

export type CreateUserInput = {
  name: string;
  email: string;
  role: string;
  password: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreated: (user: CreateUserInput) => void;
};

export function AddUserModal({ open, onClose, onCreated }: Props) {
  const [form, setForm] = useState<CreateUserInput>({
    name: "",
    email: "",
    role: "ROL-USER",
    password: "",
  });

  if (!open) return null;

  const handleSave = () => {
    if (!form.name || !form.email || !form.password) return;

    onCreated(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b flex justify-between items-center">
            <h3 className="text-lg font-bold">Crear Usuario</h3>
            <button onClick={onClose}>
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 py-6 space-y-4">
            <input
              placeholder="Nombre completo"
              className="w-full px-4 py-3 border rounded-xl"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />

            <input
              placeholder="Correo"
              className="w-full px-4 py-3 border rounded-xl"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <select
              className="w-full px-4 py-3 border rounded-xl"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <option value="ROL-ADMIN">Administrador</option>
              <option value="ROL-USER">Usuario</option>
            </select>

            <input
              type="password"
              placeholder="Contraseña"
              className="w-full px-4 py-3 border rounded-xl"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <div className="px-6 py-5 border-t flex justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 rounded-xl bg-gray-100">
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-blue-900 text-white font-bold"
            >
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}