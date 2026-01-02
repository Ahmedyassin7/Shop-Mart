"use client";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const session = useSession();

  return (
    <>
      <section className="flex min-h-[70vh] items-center justify-center bg-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 px-6 text-center sm:px-8">
          <p className="text-lg font-semibold text-slate-800">
            {session.status === "authenticated"
              ? `Welcome back, ${session.data.user?.name}!`
              : "Welcome to our store!"}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Welcome to ShopMart
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-slate-600 sm:text-xl">
            Discover the latest technology, fashion, and lifestyle products.
            Quality guaranteed with fast shipping and excellent customer
            service.
          </p>
          <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row sm:gap-4">
            <Link href="/products">
              <Button className="h-12 rounded-md border border-slate-900 bg-slate-900 px-7 text-base font-semibold text-white transition-colors hover:bg-slate-800">
                Shop Now
              </Button>
            </Link>

            <Link href="categories">
              <Button
                variant="outline"
                className="h-12 rounded-md border-2 border-slate-900 bg-white px-7 text-base font-semibold text-slate-900 transition-colors hover:bg-slate-100"
              >
                Browse Categories
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
