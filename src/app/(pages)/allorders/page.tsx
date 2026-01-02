import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { getAuthFromCookie } from "@/app/Helpers/getAuthFromCookie";


type OrderInfo = {
  _id: string;
  createdAt: string;
  updatedAt: string;
  isPaid: boolean;
  isDelivered: boolean;
  totalOrderPrice: number;
  shippingAddress?: {
    details?: string;
    city?: string;
    phone?: string;
  };
};

export default async function AllOrdersPage() {
  const { token, userId } = await getAuthFromCookie();

  if (!token || !userId) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-extrabold tracking-tight">My Orders</h1>
        <p className="mt-3 text-muted-foreground">
          Please login to view your orders.
        </p>
        <Link href="/login" className="text-blue-600 underline">
          Go to login
        </Link>
      </div>
    );
  }

  const res = await fetch(
    `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
    { headers: { token }, cache: "no-store" }
  );
  
  const payload = await res.json();
  
  // لو الريسبونس مش OK اعرض رسالة بدل ما تكمل
  if (!res.ok) {
    return (
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold tracking-tight">My Orders</h1>
        <p className="mt-6 text-red-600">
          Failed to load orders: {payload?.message ?? "Unknown error"}
        </p>
      </div>
    );
  }
  
  // خليك صارم: orders لازم تبقى array
  const orders: OrderInfo[] = Array.isArray(payload?.data) ? payload.data : [];
  


  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-4xl font-extrabold tracking-tight">My Orders</h1>

      {orders.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          You don't have any orders yet.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {orders.map((order) => (
            <Card
              key={order._id}
              className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm"
            >
              <div className="space-y-6">
                <div className="space-y-2">
                  <h2 className="text-2xl font-extrabold">
                    Order ID: {order._id}
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Order Date: {new Date(order.createdAt).toLocaleString()}
                  </p>

                  <p
                    className={`text-sm font-semibold ${
                      order.isPaid ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {order.isPaid ? "Paid" : "Not Paid"}
                  </p>

                  <p className="text-sm">
                    <span className="text-muted-foreground">Delivery: </span>
                    <span
                      className={
                        order.isDelivered
                          ? "text-green-600"
                          : "text-orange-600"
                      }
                    >
                      {order.isDelivered
                        ? "Delivered"
                        : "Not delivered yet"}
                    </span>
                  </p>

                  <p className="text-sm text-muted-foreground">
                    Total:{" "}
                    <span className="text-lg font-bold text-slate-900">
                      {order.totalOrderPrice} EGP
                    </span>
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-extrabold">
                    Shipping Address
                  </h3>

                  <div className="text-sm text-slate-700 space-y-1">
                    <p>
                      {(order.shippingAddress?.details ?? "").trim() ||
                        "No address details"}
                      {order.shippingAddress?.city
                        ? `, ${order.shippingAddress.city}`
                        : ""}
                    </p>
                    <p>{order.shippingAddress?.phone ?? "No phone"}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <Link
                    href={`/allorders/${order._id}`}
                    className="inline-flex items-center justify-center rounded-lg bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/90"
                  >
                    View Order Items
                  </Link>

                  <p className="text-sm text-muted-foreground">
                    Last Update:{" "}
                    {new Date(order.updatedAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
