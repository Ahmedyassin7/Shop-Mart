"use server";

import { getUserToken } from "@/app/Helpers/getUserToken";

export async function handleAddToWishListAction(productId: string) {
  const userToken = await getUserToken();

  const addToWishListResponse = await fetch(
    "https://ecommerce.routemisr.com/api/v1/wishlist",
    {
      method: "POST",
      body: JSON.stringify({ productId, quantity: 1 }),
      headers: {
        token: userToken,
        "Content-Type": "application/json",
      },
    }
  );

  const addToWishListResult = await addToWishListResponse.json();
  return addToWishListResult;
}
