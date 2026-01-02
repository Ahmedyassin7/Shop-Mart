"use client";

import { CartApiResponse } from "@/interfaces";
import { createContext, useEffect, useState } from "react";

export const CartContext = createContext<{
  cartData: CartApiResponse | null;
  setCartData: (value: CartApiResponse | null) => void;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
  getCart: () => Promise<void>;
}>({
  cartData: null,
  setCartData: () => {},
  isLoading: false,
  setIsLoading: () => {},
  getCart: async () => {},
});

export default function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [cartSnapshot, setCartSnapshot] = useState<CartApiResponse | null>(
    null
  );
  const [isCartLoading, setIsCartLoading] = useState(true);

  async function fetchCart() {
    setIsCartLoading(true);

    try {
      const cartResponse = await fetch("/api/get-cart", { cache: "no-store" });

      if (!cartResponse.ok) {
        setCartSnapshot(null);
        return;
      }

      const cartResult: CartApiResponse = await cartResponse.json();
      setCartSnapshot(cartResult);
    } catch (err) {
      setCartSnapshot(null);
    } finally {
      setIsCartLoading(false);
    }
  }

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cartData: cartSnapshot,
        setCartData: setCartSnapshot,
        isLoading: isCartLoading,
        setIsLoading: setIsCartLoading,
        getCart: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
