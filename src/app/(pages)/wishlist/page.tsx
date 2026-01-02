"use client";

import React, { useContext, useState } from "react";
import Loading from "@/app/loading";
import { WishListContext } from "@/components/context/wishListContext";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import AddToCart from "@/components/addToCart/page";
import { WishListApiResponse } from "@/interfaces";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function WishListPage() {
  const { wishListData, isLoading, getWishList } = useContext(WishListContext);
  const [activeRemoveProductId, setActiveRemoveProductId] = useState<
    string | null
  >(null);

  const { data: session, status } = useSession();
  const router = useRouter();

  const token = (session as any)?.token as string | undefined;

  const wishListItems = wishListData?.data ?? [];

  const ensureAuth = () => {
    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return null;
    }
    return token;
  };

  async function handleRemoveWishListItem(productId: string) {
    const authToken = ensureAuth();
    if (!authToken) return;

    setActiveRemoveProductId(productId);

    try {
      const removeResponse = await fetch(
        `https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`,
        { method: "DELETE", headers: { token: authToken } }
      );

      const removeResult: WishListApiResponse = await removeResponse.json();

      if (removeResult.status === "success") {
        toast.success("Removed from wishlist");
        await getWishList();
      } else {
        toast.error((removeResult as any)?.message || "Failed to remove");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setActiveRemoveProductId(null);
    }
  }

  if (status === "loading" || isLoading) return <Loading />;

  return (
    <>
      {wishListItems.length > 0 ? (
        <section className="bg-slate-50/50 text-foreground">
          <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="rounded-2xl border border-border bg-white p-5 sm:p-7 shadow-sm">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Wishlist Items
                  </h1>
                  <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                    {wishListItems.length} items in your wishlist
                  </p>
                </div>

                <Link href="/products" className="w-fit">
                  <Button
                    variant="outline"
                    className="h-10 rounded-xl font-semibold"
                  >
                    Browse products
                  </Button>
                </Link>
              </div>

              <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
                <div className="lg:col-span-2 space-y-4 sm:space-y-5">
                  {wishListItems.map((wishListProduct: any) => (
                    <div
                      key={wishListProduct._id}
                      className="group flex gap-4 rounded-2xl border border-border bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-md"
                    >
                      <div className="shrink-0">
                        <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-border">
                          <Image
                            src={wishListProduct?.imageCover}
                            alt={wishListProduct?.title ?? "Product"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between gap-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0 space-y-1">
                            <Link href={`/products/${wishListProduct._id}`}>
                              <h3 className="text-base sm:text-lg font-semibold group-hover:underline line-clamp-2">
                                {wishListProduct?.title}
                              </h3>
                            </Link>

                            <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">
                              {wishListProduct?.brand?.name ?? "Brand"} •{" "}
                              {wishListProduct?.category?.name ?? "Category"}
                            </p>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-base sm:text-lg font-semibold">
                              {wishListProduct?.price}{" "}
                              <span className="text-xs text-muted-foreground">
                                EGP
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex-1 min-w-[180px]">
                            <AddToCart
                              productId={wishListProduct._id}
                              variant="inline"
                              hideWishListButton
                            />
                          </div>

                          <button
                            onClick={() =>
                              handleRemoveWishListItem(wishListProduct._id)
                            }
                            disabled={
                              activeRemoveProductId === wishListProduct._id
                            }
                            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-red-600 disabled:opacity-50"
                          >
                            {activeRemoveProductId === wishListProduct._id ? (
                              <Loader2 className="animate-spin inline-block" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="lg:col-span-1 lg:sticky lg:top-20">
                  <div className="rounded-2xl border border-border bg-white p-5 sm:p-6 shadow-sm">
                    <h2 className="text-base sm:text-lg font-semibold">
                      Wishlist Summary
                    </h2>

                    <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-border">
                      <p className="text-sm text-muted-foreground">
                        Total items:{" "}
                        <span className="font-semibold text-foreground">
                          {wishListItems.length}
                        </span>
                      </p>
                    </div>

                    <div className="mt-5">
                      <Link href="/products">
                        <Button
                          variant="outline"
                          className="h-11 w-full rounded-xl font-semibold"
                        >
                          Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="container mx-auto px-4 py-14">
          <div className="mx-auto max-w-xl rounded-2xl border border-border bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Your WishList is empty
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Looks like you haven't added anything to your WishList yet.
            </p>

            <Link href="/products">
              <Button className="mt-6 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-800">
                Add Products To WishList
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
