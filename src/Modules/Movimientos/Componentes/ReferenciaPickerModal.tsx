import { useState, useMemo } from "react";
import { Search, X, ImageOff, Check } from "lucide-react";
import type { FormProductItem } from "./ProductGroupsEditor";

type Props = {
  inventory: FormProductItem[];
  alreadyAdded: string[];
  onConfirm: (selected: FormProductItem[]) => void;
  onClose: () => void;
};

export function ReferenciaPickerModal({ inventory, alreadyAdded, onConfirm, onClose }: Props) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return inventory;
    return inventory.filter(
      (p) =>
        p.ref.toLowerCase().includes(q) ||
        p.desc.toLowerCase().includes(q)
    );
  }, [inventory, search]);

  const toggle = (ref: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(ref)) next.delete(ref);
      else next.add(ref);
      return next;
    });
  };

  const handleConfirm = () => {
    const items = inventory.filter((p) => selected.has(p.ref));
    onConfirm(items);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl flex flex-col w-full max-w-3xl max-h-[88vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Seleccionar referencias</h3>
            <p className="text-sm text-gray-500">
              Elige uno o varios productos para agregar al movimiento.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por referencia o descripción..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm"
            />
          </div>
        </div>

        {/* Grid */}
        <div className="flex-1 overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
              <Search size={32} strokeWidth={1.5} />
              <p className="text-sm">No se encontraron productos.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filtered.map((product) => {
                const isSelected = selected.has(product.ref);
                const isAdded = alreadyAdded.includes(product.ref);
                return (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => toggle(product.ref)}
                    className={`relative flex flex-col rounded-xl border-2 overflow-hidden text-left transition-all focus:outline-none ${
                      isSelected
                        ? "border-blue-500 shadow-lg shadow-blue-100"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-sm"
                    }`}
                  >
                    {/* Image */}
                    <div className="w-full aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                      {product.imagen_url ? (
                        <img
                          src={product.imagen_url}
                          alt={product.ref}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageOff size={28} className="text-gray-300" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-2.5 space-y-0.5 flex-1">
                      <p className="text-xs font-bold text-gray-800 truncate">{product.ref}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 leading-tight">{product.desc}</p>
                      {product.precio_base !== undefined && (
                        <p className="text-xs font-semibold text-emerald-600 pt-0.5">
                          ${product.precio_base.toLocaleString("es-CO")}
                        </p>
                      )}
                    </div>

                    {/* Selected badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center shadow-md">
                        <Check size={13} className="text-white" strokeWidth={3} />
                      </div>
                    )}

                    {/* Already added badge */}
                    {isAdded && !isSelected && (
                      <div className="absolute top-2 left-2 text-[10px] bg-gray-700/75 text-white px-1.5 py-0.5 rounded-md leading-tight">
                        Ya añadido
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex items-center justify-between gap-4">
          <span className="text-sm text-gray-500 min-w-0">
            {selected.size === 0
              ? "Ninguna referencia seleccionada"
              : `${selected.size} referencia${selected.size !== 1 ? "s" : ""} seleccionada${selected.size !== 1 ? "s" : ""}`}
          </span>
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 text-sm font-medium"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              disabled={selected.size === 0}
              className="px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-800 disabled:opacity-40 text-white text-sm font-bold transition-colors"
            >
              Agregar {selected.size > 0 ? selected.size : ""} referencia{selected.size !== 1 ? "s" : ""}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
