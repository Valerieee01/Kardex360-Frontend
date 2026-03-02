import { useState } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import type { UserItem } from "./users.types";
import { UsersTable } from "./Componentes/UsersTables";
import { AddUserModal, type CreateUserInput } from "./Componentes/AddUserModal";

const USERS: UserItem[] = [
  { id: "USR-001", name: "Juan Pérez", role: "ROL-ADMIN", status: "Activo" },
  { id: "USR-002", name: "María Gómez", role: "ROL-USER", status: "Activo" },
];

export function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>(USERS);
  const [showAdd, setShowAdd] = useState(false);

  const handleCreated = (created: CreateUserInput) => {
    const newUser: UserItem = {
      id: "USR-" + Math.floor(Math.random() * 9999),
      name: created.name,
      role: created.role,
      status: "Activo",
    };

    setUsers((prev) => [...prev, newUser]);
    toast.success("Usuario creado correctamente");
  };

  const handleDelete = (user: UserItem) => {
    setUsers((prev) => prev.filter((u) => u.id !== user.id));
    toast.success("Usuario eliminado");
  };

  return (
    <>
      <div className="space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Usuarios del Sistema</h2>
            <p className="text-gray-500">Control de acceso y personal autorizado.</p>
          </div>

          <button
            onClick={() => setShowAdd(true)}
            className="bg-blue-900 text-white px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2"
          >
            <Users className="w-5 h-5" /> Crear Usuario
          </button>
        </div>

        <UsersTable
          users={users}
          onDelete={handleDelete}
          onEdit={(u) => console.log("Editar:", u)}
        />
      </div>

      <AddUserModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={handleCreated}
      />
    </>
  );
}