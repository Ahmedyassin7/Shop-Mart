import { BrandInfo } from "./brand";
import { CategoryInfo } from "./category";
import { SubcategoryInfo } from "./subCategory";


export interface ProductInfo {
  sold: number;
  images: string[];
  subcategory: SubcategoryInfo[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  slug: string;
  description: string;
  quantity: number;
  price: number;
  imageCover: string;
  category: CategoryInfo;
  brand: BrandInfo;
  ratingsAverage: number;
  createdAt: string;
  updatedAt: string;
  id: string;
}
