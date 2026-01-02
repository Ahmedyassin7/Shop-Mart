import { ProductInfo } from "./product";

export interface CartItemInfo {
  count: number;
  _id: string;
  product: ProductInfo;
  price: number;
}
