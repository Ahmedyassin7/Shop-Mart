import React from "react";

import { Card, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { CategoryInfo } from "@/interfaces";

export default async function CategoriesPage() {
  const categoriesResponse = await fetch(
    "https://ecommerce.routemisr.com/api/v1/categories",
    {
      cache: "no-store",
    }
  );

  const { data: categoriesList }: { data: CategoryInfo[] } =
    await categoriesResponse.json();

  return (
    <div className="py-8 sm:py-12 space-y-8 px-4">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Categories
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Discover products by browsing categories.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categoriesList.map((categoryItem) => (
          <Link
            key={categoryItem._id}
            href={`/categories/${categoryItem._id}`}
          >
            <Card className="p-3 sm:p-4 rounded-2xl border shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-1 cursor-pointer">
              <CardHeader className="p-0 space-y-4">
                <div className="relative w-full aspect-square bg-muted/30 rounded-xl overflow-hidden flex items-center justify-center">
                  <Image
                    src={categoryItem.image}
                    alt={categoryItem.name}
                    fill
                    className="object-contain p-4 sm:p-6"
                  />
                </div>

                <div className="text-center space-y-1">
                  <h3 className="text-sm sm:text-base font-semibold line-clamp-1">
                    {categoryItem.name}
                  </h3>

                  <p className="text-xs text-muted-foreground line-clamp-1">
                    View products from {categoryItem.name}
                  </p>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
