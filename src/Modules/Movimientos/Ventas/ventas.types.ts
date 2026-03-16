export type Warehouse = {
  code: string;
  name: string;
};

export type InventoryItem = {
  id: string;
  ref: string;
  desc: string;
};

export type SaleRow = {
  id: string;
  ref: string;
  qty: number;
  price: number;
  date: string;
};