import { ProductInfo } from "./product";


export interface CartApiResponse {
  status: string;
  message?: string;
  numOfCartItems: number;
  cartId: string;
  data: CartData;
}

export interface CartData {
  _id: string;
  cartOwner: string;
  products: CartItem;
  createdAt: string;
  updatedAt: string;
  __v: number;
  totalCartPrice: number;
}

export interface CartItem {
  count: number;
  _id: string;
  product: ProductInfo;
  price: number;
}
