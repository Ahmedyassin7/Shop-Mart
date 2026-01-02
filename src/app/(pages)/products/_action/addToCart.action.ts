"use server";

import { getUserToken } from "@/app/Helpers/getUserToken";

export async function handleAddToCartAction(productId: string) {
  const userToken = await getUserToken();

  const addToCartResponse = await fetch("https://ecommerce.routemisr.com/api/v1/cart", {
    method: "POST",
    body: JSON.stringify({ productId, quantity: 1 }),
    headers: {
      token: userToken,
      "Content-Type": "application/json",
    },
  });

  const addToCartResult = await addToCartResponse.json();
  return addToCartResult;
}
