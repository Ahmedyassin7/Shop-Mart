import { Params } from "next/dist/server/request/params";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import MyStarIcon from "@/components/myStar/myStarIcon";
import Slider from "@/components/productSlider/Slider";
import AddToCart from "@/components/addToCart/page";
import { Badge } from "@/components/ui/badge";
import { ProductInfo } from "@/interfaces";

export default async function ProductDetailsPage({
  params,
}: {
  params: Params;
}) {
  const { productId: selectedProductId } = await params;

  const productResponse = await fetch(
    "https://ecommerce.routemisr.com/api/v1/products/" + selectedProductId,
    { cache: "no-store" }
  );

  const { data: productData }: { data: ProductInfo } =
    await productResponse.json();

  return (
    <div className="container mx-auto px-4 py-8 sm:py-12">
      <Card className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 p-5 sm:p-7 md:p-10 rounded-2xl border shadow-sm">
        {/* Slider */}
        <div className="w-full">
          <div className="rounded-2xl overflow-hidden bg-white ring-1 ring-border">
            <div className="h-80 sm:h-105 md:h-full">
              <Slider imageUrls={productData.images} altText={productData.title} />
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col h-full">
          <CardHeader className="p-0 space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="secondary"
                className="text-xs px-3 py-1 rounded-full"
              >
                {productData.brand.name}
              </Badge>
              <Badge
                variant="secondary"
                className="text-xs px-3 py-1 rounded-full"
              >
                {productData.category.name}
              </Badge>
            </div>

            <div className="space-y-2">
              <CardTitle className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight line-clamp-2">
                {productData.title}
              </CardTitle>

              <CardDescription className="text-sm sm:text-base leading-relaxed text-muted-foreground line-clamp-3 sm:line-clamp-none">
                {productData.description}
              </CardDescription>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <MyStarIcon />
                  <MyStarIcon />
                  <MyStarIcon />
                  <MyStarIcon />
                  <MyStarIcon />
                </div>

                <span className="text-xs sm:text-sm text-muted-foreground">
                  {productData.ratingsAverage} • ({productData.ratingsQuantity})
                </span>
              </div>

              <span className="text-xs px-3 py-1 rounded-full bg-slate-100 text-slate-700 ring-1 ring-slate-200">
                In stock:{" "}
                <span className="font-semibold text-slate-900">
                  {productData.quantity}
                </span>
              </span>
            </div>
          </CardHeader>

          <CardContent className="p-0 mt-6 space-y-4">
            <div className="rounded-2xl bg-slate-50 ring-1 ring-border px-5 py-4 flex items-center justify-between">
              <p className="text-xl sm:text-2xl font-bold text-slate-900">
                {productData.price}{" "}
                <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                  EGP
                </span>
              </p>

              <p className="text-xs sm:text-sm text-muted-foreground">
                Available:{" "}
                <span className="font-semibold text-foreground">
                  {productData.quantity}
                </span>
              </p>
            </div>
          </CardContent>

          <CardFooter className="p-0 mt-6">
            <div className="w-full">
              <AddToCart productId={productData.id} />
            </div>
          </CardFooter>
        </div>
      </Card>
    </div>
  );
}
