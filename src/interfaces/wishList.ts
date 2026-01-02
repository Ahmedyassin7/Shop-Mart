import { ProductInfo } from "./product";

export interface WishListApiResponse {
  status: string;
  message?: string;
  count: number;
  data: ProductInfo[];
}
