import Swal from "sweetalert2";

export const confirmDelete = async (message: string) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: message,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#1e3a8a",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
  });

  return result.isConfirmed;
};

export const successAlert = (message: string) => {
  Swal.fire({
    icon: "success",
    title: "¡Listo!",
    text: message,
    timer: 1500,
    showConfirmButton: false,
  });
};

export const errorAlert = (message: string) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: message,
  });
};