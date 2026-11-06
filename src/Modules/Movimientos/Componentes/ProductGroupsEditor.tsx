import { useState } from "react";
import { Images, Plus, Trash2, ImageOff } from "lucide-react";
import type { ProductGroup, TallaRow } from "../Ventas/ventas.types";
import type { SizeItem } from "../../Tallas/sizes.types";
import { ReferenciaPickerModal } from "./ReferenciaPickerModal";

export type FormProductItem = {
  id: string;
  ref: string;
  desc: string;
  precio_base?: number;
  imagen_url?: string;
};

type Props = {
  groups: ProductGroup[];
  onChange: (groups: ProductGroup[]) => void;
  inventory: FormProductItem[];
  sizes: SizeItem[];
};

function createEmptyTalla(): TallaRow {
  return { id: crypto.randomUUID(), talla: "", cantidad: 1 };
}

function createEmptyGroup(): ProductGroup {
  return {
    id: crypto.randomUUID(),
    referencia: "",
    valor_unitario: 0,
    tallas: [createEmptyTalla()],
  };
}

export function ProductGroupsEditor({ groups, onChange, inventory, sizes }: Props) {
  const [showPicker, setShowPicker] = useState(false);

  const addGroup = () => onChange([...groups, createEmptyGroup()]);

  const handlePickerConfirm = (selected: FormProductItem[]) => {
    const newGroups = selected.map((item) => ({
      id: crypto.randomUUID(),
      referencia: item.ref,
      valor_unitario: item.precio_base ?? 0,
      tallas: [createEmptyTalla()],
    }));
    onChange([...groups, ...newGroups]);
    setShowPicker(false);
  };

  const removeGroup = (gid: string) => {
    if (groups.length === 1) return;
    onChange(groups.filter((g) => g.id !== gid));
  };

  const updateGroupField = (
    gid: string,
    field: "referencia" | "valor_unitario",
    value: string | number
  ) => {
    onChange(
      groups.map((g) => {
        if (g.id !== gid) return g;
        const updated: ProductGroup = { ...g, [field]: value };
        if (field === "referencia") {
          const product = inventory.find((p) => p.ref === value);
          if (product?.precio_base !== undefined) {
            updated.valor_unitario = product.precio_base;
          }
        }
        return updated;
      })
    );
  };

  const addTalla = (gid: string) =>
    onChange(
      groups.map((g) =>
        g.id === gid ? { ...g, tallas: [...g.tallas, createEmptyTalla()] } : g
      )
    );

  const removeTalla = (gid: string, tid: string) =>
    onChange(
      groups.map((g) =>
        g.id !== gid || g.tallas.length === 1
          ? g
          : { ...g, tallas: g.tallas.filter((t) => t.id !== tid) }
      )
    );

  const updateTalla = (
    gid: string,
    tid: string,
    field: "talla" | "cantidad",
    value: string | number
  ) =>
    onChange(
      groups.map((g) =>
        g.id !== gid
          ? g
          : {
              ...g,
              tallas: g.tallas.map((t) =>
                t.id === tid ? { ...t, [field]: value } : t
              ),
            }
      )
    );

  const grandTotal = groups.reduce(
    (sum, g) =>
      sum + g.tallas.reduce((s, t) => s + t.cantidad * g.valor_unitario, 0),
    0
  );

  return (
    <>
      {showPicker && (
        <ReferenciaPickerModal
          inventory={inventory}
          alreadyAdded={groups.map((g) => g.referencia).filter(Boolean)}
          onConfirm={handlePickerConfirm}
          onClose={() => setShowPicker(false)}
        />
      )}

    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between gap-3">
        <div>
          <h4 className="font-bold text-gray-900">Detalle de productos</h4>
          <p className="text-sm text-gray-500">
            Por cada referencia, agrega las tallas y cantidades.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setShowPicker(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-blue-900 text-blue-900 hover:bg-blue-50 text-sm font-medium"
          >
            <Images size={15} /> Buscar por imagen
          </button>
          <button
            type="button"
            onClick={addGroup}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 text-white hover:bg-blue-800 text-sm font-medium"
          >
            <Plus size={16} /> Agregar referencia
          </button>
        </div>
      </div>

      {/* Product groups */}
      <div className="p-5 space-y-5 bg-white">
        {groups.map((group, gIndex) => {
          const groupTotal = group.tallas.reduce(
            (s, t) => s + t.cantidad * group.valor_unitario,
            0
          );
          const totalPares = group.tallas.reduce((s, t) => s + t.cantidad, 0);
          const product = inventory.find((p) => p.ref === group.referencia);

          return (
            <div
              key={group.id}
              className="border border-gray-200 rounded-2xl overflow-hidden"
            >
              {/* Product header */}
              <div className="px-5 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* Thumbnail con tooltip */}
                  <div className="relative group/thumb shrink-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
                      {product?.imagen_url ? (
                        <img
                          src={product.imagen_url}
                          alt={product.ref}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ImageOff size={16} className="text-gray-300" />
                      )}
                    </div>
                    {/* Tooltip */}
                    {product && (
                      <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 opacity-0 group-hover/thumb:opacity-100 transition-opacity duration-150">
                        <div className="bg-gray-900 text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap shadow-lg">
                          <span className="font-bold">{product.ref}</span>
                          {product.desc && (
                            <span className="text-gray-300 ml-1">— {product.desc}</span>
                          )}
                        </div>
                        <div className="w-2 h-2 bg-gray-900 rotate-45 mx-auto -mt-1" />
                      </div>
                    )}
                  </div>

                  <span className="font-semibold text-gray-800 text-sm">
                    {product ? (
                      <span className="text-blue-900">{product.ref}</span>
                    ) : (
                      `Referencia #${gIndex + 1}`
                    )}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => removeGroup(group.id)}
                  disabled={groups.length === 1}
                  className="text-red-400 hover:text-red-600 disabled:opacity-20 p-1 rounded-lg"
                  title="Eliminar esta referencia"
                >
                  <Trash2 size={15} />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* Product selector + price */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Producto / Referencia
                    </label>
                    <select
                      value={group.referencia}
                      onChange={(e) =>
                        updateGroupField(group.id, "referencia", e.target.value)
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none text-sm"
                    >
                      <option value="">Seleccione un producto</option>
                      {inventory.map((p) => (
                        <option key={p.id} value={p.ref}>
                          {p.ref} — {p.desc}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      Valor unitario ($)
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={
                        Number.isNaN(group.valor_unitario)
                          ? 0
                          : group.valor_unitario
                      }
                      onChange={(e) =>
                        updateGroupField(
                          group.id,
                          "valor_unitario",
                          Number(e.target.value)
                        )
                      }
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl outline-none text-sm"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Tallas table */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      Tallas y cantidades
                    </span>
                    <button
                      type="button"
                      onClick={() => addTalla(group.id)}
                      className="inline-flex items-center gap-1 text-sm text-blue-700 hover:text-blue-900 font-medium"
                    >
                      <Plus size={13} /> Agregar talla
                    </button>
                  </div>

                  <div className="border border-gray-100 rounded-xl overflow-hidden">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Talla
                          </th>
                          <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide w-36">
                            Cantidad (pares)
                          </th>
                          <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Subtotal
                          </th>
                          <th className="px-2 py-2.5 w-8" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {group.tallas.map((t) => {
                          const rowTotal = t.cantidad * group.valor_unitario;
                          return (
                            <tr key={t.id} className="hover:bg-gray-50/50">
                              <td className="px-3 py-2.5">
                                <select
                                  value={t.talla}
                                  onChange={(e) =>
                                    updateTalla(
                                      group.id,
                                      t.id,
                                      "talla",
                                      e.target.value
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm min-w-[100px]"
                                  disabled={sizes.length === 0}
                                >
                                  <option value="">
                                    {sizes.length === 0
                                      ? "Sin tallas"
                                      : "Talla..."}
                                  </option>
                                  {sizes.map((s) => (
                                    <option key={s.talla} value={s.talla}>
                                      {s.talla}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-3 py-2.5">
                                <input
                                  type="number"
                                  min={1}
                                  value={
                                    Number.isNaN(t.cantidad) ? 1 : t.cantidad
                                  }
                                  onChange={(e) =>
                                    updateTalla(
                                      group.id,
                                      t.id,
                                      "cantidad",
                                      Number(e.target.value)
                                    )
                                  }
                                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg outline-none text-sm"
                                />
                              </td>
                              <td className="px-4 py-2.5 text-right font-semibold text-gray-800">
                                ${rowTotal.toLocaleString("es-CO")}
                              </td>
                              <td className="px-2 py-2.5 text-center">
                                <button
                                  type="button"
                                  onClick={() => removeTalla(group.id, t.id)}
                                  disabled={group.tallas.length === 1}
                                  className="text-red-400 hover:text-red-600 disabled:opacity-20 p-1 rounded"
                                  title="Eliminar talla"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Product subtotal */}
                <div className="flex items-center justify-between pt-1 text-sm border-t border-gray-100">
                  <span className="text-gray-500">
                    {totalPares} par{totalPares !== 1 ? "es" : ""} ·{" "}
                    {group.tallas.length} talla
                    {group.tallas.length !== 1 ? "s" : ""}
                  </span>
                  <span className="font-bold text-gray-900">
                    Subtotal: ${groupTotal.toLocaleString("es-CO")}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Grand total */}
      <div className="px-5 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
        <span className="text-sm text-gray-500">Total general del movimiento</span>
        <span className="text-xl font-bold text-gray-900">
          ${grandTotal.toLocaleString("es-CO")}
        </span>
      </div>
    </div>
    </>
  );
}
