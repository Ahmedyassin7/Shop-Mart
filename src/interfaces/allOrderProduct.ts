import { BrandInfo } from "./brand";
import { CategoryInfo } from "./category";
import { SubcategoryInfo } from "./subCategory";

export interface OrderProductInfo {
  subcategory: SubcategoryInfo[];
  ratingsQuantity: number;
  _id: string;
  title: string;
  imageCover: string;
  category: CategoryInfo;
  brand: BrandInfo;
  ratingsAverage: number;
  id: string;
}
