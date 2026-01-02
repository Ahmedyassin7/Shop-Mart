"use client";

import { createContext, useEffect, useState } from "react";

import { getUserToken } from "@/app/Helpers/getUserToken";
import { WishListApiResponse } from "@/interfaces";

export const WishListContext = createContext<{
  wishListData: WishListApiResponse | null;
  setWishListData: (v: WishListApiResponse | null) => void;
  isLoading: boolean;
  getWishList: () => void;
}>({
  wishListData: null,
  setWishListData: () => {},
  isLoading: false,
  getWishList: () => {},
});

export default function WishListProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [wishListSnapshot, setWishListSnapshot] = useState<WishListApiResponse | null>(
    null
  );
  const [isWishListLoading, setIsWishListLoading] = useState(false);

  async function fetchWishList() {
    setIsWishListLoading(true);
    const userToken = await getUserToken();

    const wishListResponse = await fetch(
      "https://ecommerce.routemisr.com/api/v1/wishlist",
      {
        method: "GET",
        headers: { token: userToken },
        cache: "no-store",
      }
    );

    const wishListResult: WishListApiResponse = await wishListResponse.json();
    setWishListSnapshot(wishListResult);
    setIsWishListLoading(false);
  }

  useEffect(() => {
    fetchWishList();
  }, []);

  return (
    <WishListContext.Provider
      value={{
        wishListData: wishListSnapshot,
        setWishListData: setWishListSnapshot,
        isLoading: isWishListLoading,
        getWishList: fetchWishList,
      }}
    >
      {children}
    </WishListContext.Provider>
  );
}
