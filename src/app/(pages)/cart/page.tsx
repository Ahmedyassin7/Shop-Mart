"use client";

import Loading from "@/app/loading";
import CheckOut from "@/components/checkOut/checkOut";
import { CartContext } from "@/components/context/cartContext";
import { Button } from "@/components/ui/button";
import { CartApiResponse } from "@/interfaces";
import { Loader2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { cartData, isLoading, getCart, setCartData } = useContext(CartContext);
  const { data: session, status } = useSession();
  const router = useRouter();

  const token = (session as any)?.token as string | undefined;

  const [removingId, setRemovingId] = useState<null | string>(null);
  const [updatingId, setUpdatingId] = useState<null | string>(null);
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    getCart();
  }, []);

  const ensureAuth = () => {
    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return null;
    }
    return token;
  };

  // delete item from cart
  async function removeCartItem(productId: string) {
    const authToken = ensureAuth();
    if (!authToken) return;

    setRemovingId(productId);
    try {
      const response = await fetch(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        {
          method: "DELETE",
          headers: { token: authToken },
        }
      );

      const data: CartApiResponse = await response.json();

      if (data.status === "success") {
        toast.success("Item removed from cart");
        setCartData(data as any);
      } else {
        toast.error((data as any)?.message || "Failed to remove item");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setRemovingId(null);
    }
  }

  // update quantity
  async function updateItemQuantity(productId: string, count: number) {
    const authToken = ensureAuth();
    if (!authToken) return;

    setUpdatingId(productId);
    try {
      const res = await fetch(
        `https://ecommerce.routemisr.com/api/v1/cart/${productId}`,
        {
          method: "PUT",
          body: JSON.stringify({ count }),
          headers: {
            token: authToken,
            "Content-Type": "application/json",
          },
        }
      );

      const data: CartApiResponse = await res.json();

      if (data.status === "success") {
        toast.success("Product quantity updated successfully");
        setCartData(data as any);
      } else {
        toast.error((data as any)?.message || "Failed to update");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setUpdatingId(null);
    }
  }

  // clear cart
  async function clearCart() {
    const authToken = ensureAuth();
    if (!authToken) return;

    setIsClearing(true);
    try {
      const res = await fetch("https://ecommerce.routemisr.com/api/v1/cart/", {
        method: "DELETE",
        headers: {
          token: authToken,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (data?.message === "success") {
        setCartData(null);
        toast.success("Cart cleared");
      } else {
        toast.error(data?.message || "Failed to clear cart");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsClearing(false);
    }
  }

  if (status === "loading" || isLoading) return <Loading />;

  const items = Array.isArray(cartData?.data?.products)
    ? cartData!.data!.products
    : [];
  const itemsCount = cartData?.numOfCartItems ?? items.length;

  return (
    <>
      {itemsCount > 0 ? (
        <section className="bg-slate-50/50">
          <div className="container mx-auto px-4 py-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                  Shopping Cart
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {itemsCount} items in your cart
                </p>
              </div>

              <Button
                variant="outline"
                onClick={clearCart}
                disabled={isClearing}
                className="mt-3 sm:mt-0 w-fit flex items-center gap-2 rounded-full border border-red-200 bg-white px-4 py-2 text-sm font-semibold text-red-500 hover:bg-red-50 disabled:opacity-50"
              >
                {isClearing ? (
                  <Loader2 className="animate-spin inline-block" />
                ) : (
                  <Trash2 className="size-4" />
                )}
                Clear cart
              </Button>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start">
              <div className="lg:col-span-2 space-y-4">
                {items.map((item: any) => (
                  <div
                    key={item._id}
                    className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md sm:flex-row sm:items-center"
                  >
                    <div className="sm:w-1/5">
                      <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-slate-100 ring-1 ring-slate-200 sm:h-28 sm:w-28">
                        <Image
                          src={item.product.imageCover}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col gap-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                          <h3 className="text-base sm:text-lg font-semibold text-slate-900 line-clamp-1">
                            {item.product.title}
                          </h3>
                          <p className="text-sm text-slate-500 line-clamp-1">
                            {item.product?.brand?.name ?? "Brand"} •{" "}
                            {item.product?.category?.name ?? "Category"}
                          </p>
                        </div>

                        <div className="sm:text-right">
                          <div className="text-lg font-semibold text-slate-900">
                            EGP {item.price}
                          </div>
                          <div className="text-xs text-slate-500">each</div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-2 py-1">
                          <button
                            disabled={
                              item.count === 1 ||
                              updatingId === item.product._id
                            }
                            aria-label="decrease"
                            className="flex h-9 w-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-50"
                            onClick={() =>
                              updateItemQuantity(
                                item.product._id,
                                item.count - 1
                              )
                            }
                          >
                            -
                          </button>

                          <span className="min-w-10 text-center text-sm font-semibold text-slate-900">
                            {updatingId === item.product._id ? (
                              <Loader2 className="animate-spin inline-block" />
                            ) : (
                              item.count
                            )}
                          </span>

                          <button
                            disabled={updatingId === item.product._id}
                            aria-label="increase"
                            onClick={() =>
                              updateItemQuantity(
                                item.product._id,
                                item.count + 1
                              )
                            }
                            className="flex h-9 w-10 items-center justify-center rounded-full bg-white text-lg font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50 disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removeCartItem(item.product._id)}
                          disabled={removingId === item.product._id}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-red-600 disabled:opacity-50"
                        >
                          {removingId === item.product._id ? (
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
                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-semibold text-slate-900">
                    Order Summary
                  </h2>

                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">
                        Subtotal ({itemsCount} items)
                      </span>
                      <span className="font-semibold text-slate-900">
                        EGP {cartData?.data?.totalCartPrice ?? 0}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Shipping</span>
                      <span className="font-semibold text-green-600">Free</span>
                    </div>

                    <div className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                      <div className="flex items-center justify-between text-base font-semibold text-slate-900">
                        <span>Total</span>
                        <span>EGP {cartData?.data?.totalCartPrice ?? 0}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <Link href="/products">
                      <Button
                        variant="outline"
                        className="h-11 w-full rounded-xl border-2 border-slate-300 bg-white text-sm font-semibold text-slate-800 hover:bg-slate-50"
                      >
                        Continue Shopping
                      </Button>
                    </Link>

                    {cartData?.cartId && <CheckOut cartId={cartData.cartId} />}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : (
        <div className="container mx-auto px-4 py-14">
          <div className="mx-auto max-w-xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">
              Your cart is empty
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Looks like you haven't added anything to your cart yet.
            </p>

            <Link href="/products">
              <Button className="mt-6 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white hover:bg-slate-800">
                Add Products To Cart
              </Button>
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
