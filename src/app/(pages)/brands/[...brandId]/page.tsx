import AddToCart from "@/components/addToCart/page";
import MyStarIcon from "@/components/myStar/myStarIcon";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { Params } from "next/dist/server/request/params";
import Image from "next/image";
import Link from "next/link";
import { BrandInfo, ProductInfo } from "@/interfaces";

export default async function BrandDetailsPage({ params }: { params: Params }) {
  const { brandId: selectedBrandId } = await params;

  const [brandResponse, productsResponse] = await Promise.all([
    fetch(`https://ecommerce.routemisr.com/api/v1/brands/${selectedBrandId}`, {
      cache: "no-store",
    }),
    fetch(
      `https://ecommerce.routemisr.com/api/v1/products?brand=${selectedBrandId}`,
      {
        cache: "no-store",
      }
    ),
  ]);

  const { data: brandData }: { data: BrandInfo } = await brandResponse.json();
  const { data: brandProducts }: { data: ProductInfo[] } =
    await productsResponse.json();

  return (
    <div className="py-8 sm:py-12 space-y-8 px-4">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {brandData.name}
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Products from this brand
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {brandProducts.map((productItem) => (
          <Card
            key={productItem.id}
            className="flex flex-col h-full rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 overflow-hidden"
          >
            <Link href={`/products/${productItem.id}`} className="flex-1 block">
              <CardHeader className="space-y-3 p-3 sm:p-6">
                <div className="relative w-full aspect-3/4 sm:aspect-4/5 bg-muted/30 rounded-xl overflow-hidden ring-1 ring-border">
                  <Image
                    src={productItem.imageCover}
                    alt={productItem.title}
                    fill
                    className="object-contain p-3 sm:p-4"
                  />
                </div>

                <CardTitle className="text-sm sm:text-base font-semibold leading-snug line-clamp-2">
                  {productItem.title}
                </CardTitle>

                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full"
                  >
                    {productItem.category.name}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className="text-[10px] sm:text-xs px-2.5 py-1 rounded-full"
                  >
                    {productItem.brand.name}
                  </Badge>
                </div>

                <CardDescription className="hidden sm:block line-clamp-2">
                  {productItem.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3 px-3 pb-3 sm:px-6 sm:pb-6">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <MyStarIcon />
                      <MyStarIcon />
                      <MyStarIcon />
                      <MyStarIcon />
                      <MyStarIcon />
                    </div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      ({productItem.ratingsQuantity})
                    </span>
                  </div>

                  <span className="text-xs sm:text-sm font-semibold text-slate-900">
                    {productItem.price}{" "}
                    <span className="font-medium text-muted-foreground">
                      EGP
                    </span>
                  </span>
                </div>
              </CardContent>
            </Link>

            <CardFooter className="pt-0 px-3 pb-3 sm:px-6 sm:pb-6">
              <div className="w-full">
                <AddToCart productId={productItem.id} />
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
