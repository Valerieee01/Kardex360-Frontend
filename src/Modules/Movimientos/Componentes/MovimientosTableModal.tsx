import { X } from "lucide-react";
import { RecentSalesTable } from "../Ventas/Componentes/VentasRecientesTables";
import type { SaleRow } from "../Ventas/ventas.types";

type Props = {
  open: boolean;
  onClose: () => void;
  rows: SaleRow[];
  filter: "VENTA" | "ENTRADA" | "TRASPASO";
  onEdit: (codigo: string) => void;
  onAnnul: (codigo: string) => void;
  title: string;
  subtitle: string;
};

export function MovimientosTableModal({
  open,
  onClose,
  rows,
  filter,
  onEdit,
  onAnnul,
  title,
  subtitle,
}: Props) {
  if (!open) return null;

  const handleEdit = (codigo: string) => {
    onClose();
    onEdit(codigo);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          <RecentSalesTable
            rows={rows}
            filter={filter}
            onChangeFilter={() => {}}
            onEdit={handleEdit}
            onAnnul={onAnnul}
            hideFilter
            hidePanelHeader
            title=""
            subtitle=""
          />
        </div>
      </div>
    </div>
  );
}
