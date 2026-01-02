"use client";

import React, { useContext, useState } from "react";
import { CardFooter } from "../ui/card";
import { Button } from "../ui/button";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

import { handleAddToCartAction } from "@/app/(pages)/products/_action/addToCart.action";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { CartContext } from "../context/cartContext";
import AddToWishListButton from "../addToWishList/AddtoWishList";


type AddToCartProps = {
  productId: string;
  hideWishListButton?: boolean;
  variant?: "card" | "inline";
};

export default function AddToCartButton({
  productId,
  hideWishListButton = false,
  variant = "card",
}: AddToCartProps) {
  const { setCartData } = useContext(CartContext);

  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const session = useSession();
  const router = useRouter();

  async function handleAddProductToCart() {
    if (session.status === "authenticated") {
      setIsAddingToCart(true);

      const addToCartResult = await handleAddToCartAction(productId);

      if (addToCartResult.status === "success") {
        toast.success("Product added to cart successfully");
        setCartData(addToCartResult);
      }

      setIsAddingToCart(false);
    } else {
      toast.error("You must be logged in to add products to the cart");
      router.push("/login");
    }
  }

  if (variant === "inline") {
    return (
      <div className="flex items-center gap-2">
        <Button
          className="w-full rounded-xl font-semibold"
          onClick={handleAddProductToCart}
          disabled={isAddingToCart}
        >
          {isAddingToCart ? <Loader className="animate-spin" /> : "Add To Cart"}
        </Button>

        {!hideWishListButton && <AddToWishListButton productId={productId} />}
      </div>
    );
  }

  return (
    <CardFooter className="gap-2">
      <Button className="grow" onClick={handleAddProductToCart} disabled={isAddingToCart}>
        {isAddingToCart ? <Loader className="animate-spin" /> : "Add To Cart"}
      </Button>

      {!hideWishListButton && <AddToWishListButton productId={productId} />}
    </CardFooter>
  );
}
