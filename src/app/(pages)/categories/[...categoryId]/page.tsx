import AddToCart from "@/components/addToCart/page";
import MyStarIcon from "@/components/myStar/myStarIcon";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { CategoryInfo, ProductInfo } from "@/interfaces";
import { Params } from "next/dist/server/request/params";
import Image from "next/image";
import Link from "next/link";

export default async function CategoryDetailsPage({
  params,
}: {
  params: Params;
}) {
  const { categoryId: selectedCategoryId } = await params;

  const [categoryResponse, productsResponse] = await Promise.all([
    fetch(
      `https://ecommerce.routemisr.com/api/v1/categories/${selectedCategoryId}`
    ),
    fetch(
      `https://ecommerce.routemisr.com/api/v1/products?category=${selectedCategoryId}`
    ),
  ]);

  const { data: categoryData }: { data: CategoryInfo } =
    await categoryResponse.json();
  const { data: categoryProducts }: { data: ProductInfo[] } =
    await productsResponse.json();

  return (
    <div className="py-6 sm:py-10 space-y-6 px-4">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">{categoryData.name}</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-2">
          Products in this category
        </p>
      </div>

      {categoryProducts.length === 0 ? (
        <div className="min-h-[45vh] flex items-center justify-center">
          <p className="text-muted-foreground text-base sm:text-lg">
            No products found in this category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {categoryProducts.map((productCardItem) => (
            <Card
              key={productCardItem.id}
              className="flex flex-col h-full drop-shadow-sm hover:drop-shadow-2xl hover:-translate-y-1 transition-all duration-300"
            >
              <Link href={`/products/${productCardItem.id}`} className="flex-1">
                <CardHeader className="space-y-2 p-3 sm:p-4">
                  <div className="relative w-full aspect-3/4 sm:aspect-4/5 bg-white rounded-xl overflow-hidden">
                    <Image
                      src={productCardItem.imageCover}
                      alt={productCardItem.title}
                      fill
                      className="object-contain p-3 sm:p-4"
                    />
                  </div>

                  <CardTitle className="text-sm sm:text-lg font-bold line-clamp-2">
                    {productCardItem.title}
                  </CardTitle>

                  <div className="flex flex-wrap gap-1 text-[10px] sm:text-xs text-muted-foreground">
                    <span>{productCardItem.category.name}</span>
                    <span>•</span>
                    <span>{productCardItem.brand.name}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 px-3 pb-3 sm:px-4 sm:pb-4">
                  <div className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                    <MyStarIcon />
                    <MyStarIcon />
                    <MyStarIcon />
                    <MyStarIcon />
                    <span className="ml-1">
                      {productCardItem.ratingsQuantity}
                    </span>
                  </div>

                  <p className="text-base sm:text-lg font-bold">
                    {productCardItem.price}{" "}
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                      EGP
                    </span>
                  </p>
                </CardContent>
              </Link>

              <CardFooter className="px-3 pb-3 sm:px-4 sm:pb-4 pt-0">
                <div className="w-full">
                  <AddToCart productId={productCardItem.id} />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
