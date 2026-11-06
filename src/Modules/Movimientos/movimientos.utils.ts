import type { MovementApiItem, MovementType, ProductGroup, SaleRow, TallaRow } from "./Ventas/ventas.types";

export function buildMovementCode(tipo: MovementType): string {
  const prefix = tipo === "ENTRADA" ? "ENT" : tipo === "VENTA" ? "VEN" : "TRA";
  const now = new Date();
  const s = (n: number, p = 2) => String(n).padStart(p, "0");
  return `MOV-${prefix}-${now.getFullYear()}${s(now.getMonth() + 1)}${s(now.getDate())}${s(now.getHours())}${s(now.getMinutes())}${s(now.getSeconds())}`;
}

export function formatDate(value?: string) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export function getApiSuccess(response: any): boolean | undefined {
  return response?.success ?? response?.data?.success;
}

export function getApiMessage(response: any, fallback: string): string {
  return response?.message ?? response?.data?.message ?? fallback;
}

export function createEmptyGroup(): ProductGroup {
  return {
    id: crypto.randomUUID(),
    referencia: "",
    valor_unitario: 0,
    tallas: [{ id: crypto.randomUUID(), talla: "", cantidad: 1 }],
  };
}

export function buildProductGroups(
  detalle: MovementApiItem["movimiento_detalle"]
): ProductGroup[] {
  if (!detalle?.length) return [createEmptyGroup()];

  const map = new Map<string, ProductGroup>();
  for (const d of detalle) {
    if (!map.has(d.referencia)) {
      map.set(d.referencia, {
        id: crypto.randomUUID(),
        referencia: d.referencia,
        valor_unitario: Number(d.valor_unitario),
        tallas: [],
      });
    }
    map.get(d.referencia)!.tallas.push({
      id: crypto.randomUUID(),
      talla: d.talla,
      cantidad: Number(d.cantidad),
    } as TallaRow);
  }
  return [...map.values()];
}

export function flattenGroups(groups: ProductGroup[]) {
  return groups.flatMap((g) =>
    g.tallas.map((t) => ({
      referencia: g.referencia,
      talla: t.talla,
      cantidad: t.cantidad,
      valor_unitario: g.valor_unitario,
    }))
  );
}

export function normalizeMovementRows(
  items: MovementApiItem[],
  inventoryMap?: Map<string, { imagen_url: string; desc: string }>
): SaleRow[] {
  const rows: SaleRow[] = [];

  for (const mov of items) {
    const detalles = Array.isArray(mov.movimiento_detalle) ? mov.movimiento_detalle : [];

    const estadoTexto =
      mov.estado === true ? "ACTIVO" : mov.estado === false ? "ANULADO" : String(mov.estado ?? "ACTIVO");

    const warehouse =
      mov.tipo === "VENTA"
        ? mov.bodega_origen || "-"
        : mov.tipo === "TRASPASO"
        ? `${mov.bodega_origen || "-"} → ${mov.bodega_destino || "-"}`
        : mov.bodega_destino || "-";

    if (detalles.length === 0) {
      rows.push({
        id: `${mov.codigo_movimiento}-0`,
        codigo_movimiento: mov.codigo_movimiento,
        tipo: mov.tipo,
        responsable: mov.responsable,
        ref: "-",
        desc: "",
        imagen_url: "",
        talla: "-",
        qty: 0,
        price: 0,
        total: 0,
        warehouse,
        date: formatDate(mov.fecha || mov.created_at || mov.updated_at),
        estado: estadoTexto,
        observacion: mov.observacion,
      });
      continue;
    }

    for (let index = 0; index < detalles.length; index++) {
      const d = detalles[index];
      const qty = Number(d.cantidad ?? 0);
      const price = Number(d.valor_unitario ?? 0);
      const product = inventoryMap?.get(d.referencia);

      rows.push({
        id: `${mov.codigo_movimiento}-${d.item ?? index}`,
        codigo_movimiento: mov.codigo_movimiento,
        tipo: mov.tipo,
        responsable: mov.responsable,
        ref: d.referencia || "-",
        desc: product?.desc ?? "",
        imagen_url: product?.imagen_url ?? "",
        talla: d.talla || "-",
        qty,
        price,
        total: qty * price,
        warehouse,
        date: formatDate(mov.fecha || mov.created_at || mov.updated_at),
        estado: estadoTexto,
        observacion: mov.observacion,
      });
    }
  }

  return rows;
}
