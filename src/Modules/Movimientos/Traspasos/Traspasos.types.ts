export type Warehouse = {
  code: string;
  name: string;
};

export type InventoryTransferItem = {
  id: string;
  ref: string;
  desc: string;
  qty: number;
};