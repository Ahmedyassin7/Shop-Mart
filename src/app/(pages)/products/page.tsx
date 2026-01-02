import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import MyStarIcon from "@/components/myStar/myStarIcon";
import Link from "next/link";
import AddToCart from "@/components/addToCart/page";
import { ProductInfo } from "@/interfaces";

export default async function Products() {
  const res = await fetch("https://ecommerce.routemisr.com/api/v1/products");
  const { data: products }: { data: ProductInfo[] } = await res.json();

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 py-6">
        {products.map((product) => (
          <div key={product.id}>
            <Card className="rounded-2xl border shadow-sm overflow-hidden transition hover:shadow-md">
              <Link href={"/products/" + product.id} className="block">
                <CardHeader className="p-4 space-y-3">
                  <div className="relative w-full aspect-square bg-muted/30 rounded-xl overflow-hidden">
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-200 hover:scale-[1.03]"
                    />
                  </div>

                  <div className="space-y-2">
                    <CardTitle className="text-base sm:text-lg font-semibold line-clamp-1">
                      {product.title.split(" ", 2).join(" ")}
                    </CardTitle>

                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {product.category.name}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-700">
                        {product.brand.name}
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="px-4 pb-4 pt-0 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MyStarIcon />
                      <MyStarIcon />
                      <MyStarIcon />
                      <MyStarIcon />
                      <p className="ml-2 text-sm font-medium text-slate-700">
                        {product.ratingsAverage}
                      </p>
                    </div>

                    <p className="text-sm text-slate-500">
                      EGP{" "}
                      <span className="text-base font-semibold text-slate-900">
                        {product.price}
                      </span>
                    </p>
                  </div>

                  <CardDescription className="text-xs text-muted-foreground line-clamp-1">
                   
                    View details & add to cart
                  </CardDescription>
                </CardContent>
              </Link>

              <div className="p-4 pt-0">
                <AddToCart productId={product.id} />
              </div>
            </Card>
          </div>
        ))}
      </div>
    </>
  );
}
