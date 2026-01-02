"use client";
import React, { useContext, useState } from "react";
import { WishListContext, } from "../context/wishListContext";
import { useSession } from "next-auth/react";

import { handleAddToWishListAction } from "@/app/(pages)/products/_action/addToWishListApi.action";
import toast from "react-hot-toast";
import { HeartIcon, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AddToWishListButton({ productId }: { productId: string }) {
  const { setWishListData, getWishList } = useContext(WishListContext);

  const [isAddingToWishList, setIsAddingToWishList] = useState(false);

  const session = useSession();
  const router = useRouter();

  async function handleAddProductToWishList() {
    if (session.status === "authenticated") {
      setIsAddingToWishList(true);

      const addToWishListResult = await handleAddToWishListAction(productId);

      if (addToWishListResult.status === "success") {
        toast.success("Product added to wishlist successfully ");
        await getWishList();
      } else {
        toast.error(addToWishListResult.message || "Something went wrong");
      }

      setIsAddingToWishList(false);
    } else {
      toast.error("You must be logged in to add products to the wishlist");
      router.push("/login");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={handleAddProductToWishList}
        disabled={isAddingToWishList}
        aria-label="Add to wishlist"
      >
        {isAddingToWishList ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <HeartIcon className="h-5 w-5 hover:text-red-500" />
        )}
      </button>
    </>
  );
}
