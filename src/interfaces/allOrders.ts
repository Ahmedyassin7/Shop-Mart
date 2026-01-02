import { CartItemInfo } from "./cartItem";
import { ProductInfo } from "./product";
import { UserInfo } from "./user";

export interface OrderInfo {
  shippingAddress?: ShippingAddressInfo;
  taxPrice: number;
  shippingPrice: number;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  _id: string;
  user: UserInfo;
  cartItems: CartItemInfo[];
  createdAt: string;
  updatedAt: string;
  id: number;
  products: ProductInfo[];
}

export interface ShippingAddressInfo {
  details: string;
  phone: string;
  city: string;
}
