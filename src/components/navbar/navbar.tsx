"use client";

import React, { useContext } from "react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Badge } from "@/components/ui/badge";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Link from "next/link";
import { Heart, Loader2, ShoppingCart, UserIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { CartContext } from "../context/cartContext";
import { WishListContext } from "../context/wishListContext";

export default function Navbar() {
  const { cartData, isLoading: isCartLoading } = useContext(CartContext);
  const { wishListData, isLoading: isWishListLoading } =
    useContext(WishListContext);

  const session = useSession();
  const isAuthenticated = session.status === "authenticated";

  const wishListItemsCount = wishListData?.count ?? 0;
  const cartItemsCount = cartData?.numOfCartItems ?? 0;

  return (
    <nav className="bg-gray-100 shadow text-2xl font-semibold py-4">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" className="relative">
            <span className="rounded-lg bg-black text-white px-3 py-0.5 absolute">
              S
            </span>
            <h1 className="relative -end-11 -bottom-1 font-extrabold">
              Shop Mart
            </h1>
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/products">Products</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/brands">Brands</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/categories">Categories</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <Link
                href="/wishlist"
                className="relative p-2 rounded-full hover:bg-muted transition"
                aria-label="Wishlist"
              >
                <Heart className="h-6 w-6" />
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center rounded-full text-xs">
                  {isWishListLoading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    wishListItemsCount
                  )}
                </Badge>
              </Link>
            )}

            {isAuthenticated && (
              <Link
                href="/cart"
                className="relative p-2 rounded-full hover:bg-muted transition"
                aria-label="Cart"
              >
                <ShoppingCart className="h-6 w-6" />
                <Badge className="absolute -top-1 -right-1 h-5 min-w-5 px-1 flex items-center justify-center rounded-full text-xs">
                  {isCartLoading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    cartItemsCount
                  )}
                </Badge>
              </Link>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  aria-label="Account"
                  className="p-2 rounded-full hover:bg-muted transition"
                >
                  <UserIcon className="h-6 w-6" />
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />

                {isAuthenticated ? (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/allorders">Orders</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      className="text-red-500 cursor-pointer"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/login">Login</Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild>
                      <Link href="/register">Register</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
