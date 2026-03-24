import { useEffect, useMemo, useState } from "react";
import {
  Filter,
  MoreVertical,
  Plus,
  Search,
  Copy,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { ImageWithFallback } from "../../app/components/figma/ImageWithFallback";
import AddProductModal from "./AddProductModal";
import type { ProductFormValues, ProductItem } from "./inventory.types";
import {
  createProductService,
  listProductsService,
  updateProductService,
} from "../../services/products.service";

type ModalMode = "create" | "edit" | "clone";

const emptyProduct: ProductFormValues = {
  referencia: "",
  descripcion: "",
  imagen_url: "",
  precio_base: "",
  estado: true,
};

type InventoryRowProps = {
  item: ProductItem;
  onEdit: (item: ProductItem) => void;
  onClone: (item: ProductItem) => void;
};

function InventoryRow({ item, onEdit, onClone }: InventoryRowProps) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0">
      <td className="px-6 py-4">
        <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200">
          <ImageWithFallback
            src={item.imagen_url || "https://via.placeholder.com/150"}
            alt={item.descripcion}
            className="w-full h-full object-cover"
          />
        </div>
      </td>

      <td className="px-6 py-4 font-medium text-gray-900">{item.referencia}</td>
      <td className="px-6 py-4 text-gray-600">{item.descripcion}</td>
      <td className="px-6 py-4 font-semibold text-gray-900">
        ${item.precio_base.toLocaleString("es-CO")}
      </td>
      <td className="px-6 py-4">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
            item.estado
              ? "bg-emerald-100 text-emerald-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {item.estado ? "Activo" : "Inactivo"}
        </span>
      </td>

      <td className="px-6 py-4 text-right relative">
        <button
          onClick={() => setShowMenu((prev) => !prev)}
          className="text-gray-400 hover:text-gray-600"
        >
          <MoreVertical className="w-5 h-5" />
        </button>

        {showMenu && (
          <div className="absolute right-6 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-10">
            <button
              onClick={() => {
                setShowMenu(false);
                onEdit(item);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50"
            >
              <Pencil className="w-4 h-4" />
              Editar
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                onClone(item);
              }}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50"
            >
              <Copy className="w-4 h-4" />
              Clonar
            </button>
          </div>
        )}
      </td>
    </tr>
  );
}

export default function InventoryPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("todos");

  const [openModal, setOpenModal] = useState(false);
  const [modalMode, setModalMode] = useState<ModalMode>("create");
  const [selectedProduct, setSelectedProduct] =
    useState<ProductFormValues | null>(null);
  const [selectedOriginalReference, setSelectedOriginalReference] = useState<
    string | null
  >(null);

  const loadProducts = async () => {
    try {
      const data = await listProductsService();

      const mapped: ProductItem[] = data.map((p) => ({
        referencia: p.referencia,
        descripcion: p.descripcion,
        imagen_url: p.imagen_url || "",
        precio_base: Number(p.precio_base),
        estado: Boolean(p.estado),
      }));

      setProducts(mapped);
    } catch (error) {
      console.error(error);
      toast.error("No fue posible cargar los productos");
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        item.referencia.toLowerCase().includes(searchValue) ||
        item.descripcion.toLowerCase().includes(searchValue);

      const matchesStatus =
        statusFilter === "todos"
          ? true
          : statusFilter === "activo"
          ? item.estado
          : !item.estado;

      return matchesSearch && matchesStatus;
    });
  }, [products, search, statusFilter]);

  const handleCreate = async (form: ProductFormValues) => {
    await createProductService({
      referencia: form.referencia,
      descripcion: form.descripcion,
      imagen_url: form.imagen_url,
      precio_base: Number(form.precio_base),
      estado: form.estado,
    });

    toast.success("Producto creado correctamente");
    await loadProducts();
  };

  const handleUpdate = async (form: ProductFormValues) => {
    if (!selectedOriginalReference) return;

    await updateProductService(selectedOriginalReference, {
      descripcion: form.descripcion,
      imagen_url: form.imagen_url,
      precio_base: Number(form.precio_base),
      estado: form.estado,
    });

    toast.success("Producto actualizado correctamente");
    await loadProducts();
  };

  const handleClone = async (form: ProductFormValues) => {
    await createProductService({
      referencia: form.referencia,
      descripcion: form.descripcion,
      imagen_url: form.imagen_url,
      precio_base: Number(form.precio_base),
      estado: form.estado,
    });

    toast.success("Producto clonado correctamente");
    await loadProducts();
  };

  const handleSubmit = async (form: ProductFormValues) => {
    if (modalMode === "edit") {
      await handleUpdate(form);
      return;
    }

    if (modalMode === "clone") {
      await handleClone(form);
      return;
    }

    await handleCreate(form);
  };

  const handleOpenCreate = () => {
    setModalMode("create");
    setSelectedProduct(emptyProduct);
    setSelectedOriginalReference(null);
    setOpenModal(true);
  };

  const handleEdit = (item: ProductItem) => {
    setModalMode("edit");
    setSelectedOriginalReference(item.referencia);
    setSelectedProduct({
      referencia: item.referencia,
      descripcion: item.descripcion,
      imagen_url: item.imagen_url,
      precio_base: item.precio_base,
      estado: item.estado,
    });
    setOpenModal(true);
  };

  const handleOpenClone = (item: ProductItem) => {
    setModalMode("clone");
    setSelectedOriginalReference(null);
    setSelectedProduct({
      referencia: `${item.referencia}-COPIA`,
      descripcion: `${item.descripcion} (Copia)`,
      imagen_url: item.imagen_url,
      precio_base: item.precio_base,
      estado: item.estado,
    });
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedProduct(null);
    setSelectedOriginalReference(null);
    setModalMode("create");
  };

  const modalTitle =
    modalMode === "edit"
      ? "Editar Producto"
      : modalMode === "clone"
      ? "Clonar Producto"
      : "Agregar Nuevo Producto";

  const modalSubmitText =
    modalMode === "edit"
      ? "Actualizar Producto"
      : modalMode === "clone"
      ? "Guardar Clon"
      : "Guardar Producto";

  const existingReferences = products.map((p) => p.referencia);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventario</h2>
          <p className="text-gray-500">
            Gestione sus productos y niveles de stock.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center justify-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-4 py-2.5 rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/10 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Agregar Producto
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50/30 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filtrar por referencia o descripción..."
              className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all outline-none text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-900/10"
            >
              <option value="todos">Todos los Estados</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>

            <button className="p-2 text-gray-500 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg transition-all">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Imagen
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Referencia
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((item) => (
                  <InventoryRow
                    key={item.referencia}
                    item={item}
                    onEdit={handleEdit}
                    onClone={handleOpenClone}
                  />
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                    No hay productos para mostrar
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Mostrando {filteredProducts.length} producto(s)
            </p>
          </div>
        </div>
      </div>

      <AddProductModal
        open={openModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        initialValues={selectedProduct}
        title={modalTitle}
        submitText={modalSubmitText}
        disableReference={modalMode === "edit"}
        existingReferences={existingReferences}
        originalReference={modalMode === "edit" ? selectedOriginalReference : null}
      />
    </div>
  );
}