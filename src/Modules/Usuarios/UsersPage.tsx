import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { toast } from "sonner";
import type { UserItem } from "./users.types";
import { UsersTable } from "./Componentes/UsersTables";
import { AddUserModal, type CreateUserInput } from "./Componentes/AddUserModal";
import { EditUserModal, type EditUserInput } from "./Componentes/EditUserModal";
import {
  createUserService,
  listUsersService,
  updateUserService,
  updateUserStatusService,
} from "../../services/usuarios.service";

export function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await listUsersService();

      const mappedUsers: UserItem[] = data.map((user) => ({
        id: user.identificacion,
        identificacion: user.identificacion,
        name: user.nombre_completo,
        role: user.roles?.[0] || "Sin rol",
        status: user.estado ? "Activo" : "Inactivo",
      }));

      setUsers(mappedUsers);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error al cargar usuarios";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreated = async (created: CreateUserInput) => {
    try {
      await createUserService({
        identificacion: created.identificacion,
        nombre_completo: created.nombre_completo,
        estado: true,
        password: created.password,
        roles: [created.role],
      });

      toast.success("Usuario creado correctamente");
      await loadUsers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo crear el usuario";
      toast.error(message);
    }
  };

  const handleOpenEdit = (user: UserItem) => {
    setSelectedUser(user);
    setShowEdit(true);
  };

  const handleEditSave = async (data: EditUserInput) => {
  try {
    const payload: {
      nombre_completo: string;
      estado: boolean;
      roles: string[];
      password?: string;
    } = {
      nombre_completo: data.nombre_completo,
      estado: data.estado,
      roles: [data.role],
    };

    if (data.password.trim()) {
      payload.password = data.password.trim();
    }

    await updateUserService(data.identificacion, payload);

    toast.success("Usuario actualizado correctamente");
    await loadUsers();
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo actualizar el usuario";
    toast.error(message);
  }
};

  const handleToggleStatus = async (user: UserItem) => {
    try {
      const nuevoEstado = user.status !== "Activo";

      await updateUserStatusService(user.identificacion, nuevoEstado);

      toast.success(
        nuevoEstado
          ? "Usuario activado correctamente"
          : "Usuario inactivado correctamente"
      );

      await loadUsers();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "No se pudo actualizar el estado";
      toast.error(message);
    }
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

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center text-gray-500">
            Cargando usuarios...
          </div>
        ) : (
          <UsersTable
            users={users}
            onEdit={handleOpenEdit}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </div>

      <AddUserModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={handleCreated}
      />

      <EditUserModal
        open={showEdit}
        onClose={() => {
          setShowEdit(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSave={handleEditSave}
      />
    </>
  );
}