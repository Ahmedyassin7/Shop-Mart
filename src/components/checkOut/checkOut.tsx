"use client";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { getUserToken } from "@/app/Helpers/getUserToken";
import { Loader2 } from "lucide-react";

export default function CheckOutModal({ cartId }: { cartId: string }) {
  const shippingDetailsRef = useRef<HTMLInputElement>(null);
  const shippingCityRef = useRef<HTMLInputElement>(null);
  const shippingPhoneRef = useRef<HTMLInputElement>(null);

  const [isCashSubmitting, setIsCashSubmitting] = useState(false);
  const [isVisaSubmitting, setIsVisaSubmitting] = useState(false);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const router = useRouter();

  function buildShippingAddress() {
    return {
      details: shippingDetailsRef.current?.value.trim() || "",
      city: shippingCityRef.current?.value.trim() || "",
      phone: shippingPhoneRef.current?.value.trim() || "",
    };
  }

  function isShippingAddressValid(shippingAddress: any) {
    if (!shippingAddress.details || !shippingAddress.city || !shippingAddress.phone) {
      toast.error("Please fill all shipping fields");
      return false;
    }
    return true;
  }

  // Visa Checkout Session
  async function handleCreateVisaCheckoutSession() {
    const userToken = await getUserToken();
    const shippingAddress = buildShippingAddress();

    if (!isShippingAddressValid(shippingAddress)) return;

    try {
      setIsVisaSubmitting(true);
      toast.loading("Creating Visa session...", { id: "visa" });

      const visaSessionResponse = await fetch(
        `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=https://shop-mart-app-seven.vercel.app/`,
        {
          method: "POST",
          body: JSON.stringify(shippingAddress),
          headers: {
            token: userToken,
            "Content-Type": "application/json",
          },
        }
      );

      const visaSessionResult = await visaSessionResponse.json();

      if (!visaSessionResponse.ok) {
        toast.error(visaSessionResult?.message || "Failed to create Visa session", {
          id: "visa",
        });
        return;
      }

      toast.success("Redirecting to payment...", { id: "visa" });

      setIsDialogOpen(false);

      window.location.href = visaSessionResult.session.url;
    } catch {
      toast.error("Network error", { id: "visa" });
    } finally {
      setIsVisaSubmitting(false);
    }
  }

  // Cash Order
  async function handleCreateCashOrder() {
    const userToken = await getUserToken();
    const shippingAddress = buildShippingAddress();

    if (!isShippingAddressValid(shippingAddress)) return;

    try {
      setIsCashSubmitting(true);
      toast.loading("Creating Cash order...", { id: "cash" });

      const cashOrderResponse = await fetch(
        `https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
        {
          method: "POST",
          body: JSON.stringify(shippingAddress),
          headers: {
            token: userToken,
            "Content-Type": "application/json",
          },
        }
      );

      const cashOrderResult = await cashOrderResponse.json();

      if (!cashOrderResponse.ok) {
        toast.error(cashOrderResult?.message || "Failed to create order", {
          id: "cash",
        });
        return;
      }

      toast.success("Order created successfully ", { id: "cash" });

      setIsDialogOpen(false);

      router.push("/allorders");
      router.refresh();
    } catch {
      toast.error("Network error", { id: "cash" });
    } finally {
      setIsCashSubmitting(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="h-11 w-full rounded-lg bg-slate-900 text-sm font-semibold text-white hover:bg-slate-800">
          Proceed to Checkout
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Shipping Address</DialogTitle>
          <DialogDescription>
            Add your shipping address to complete your order.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <Input
            ref={shippingDetailsRef}
            placeholder="Details (street, building...)"
          />
          <Input ref={shippingCityRef} placeholder="City" />
          <Input ref={shippingPhoneRef} placeholder="Phone" />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            type="button"
            disabled={isVisaSubmitting}
            onClick={handleCreateVisaCheckoutSession}
          >
            {isVisaSubmitting ? <Loader2 /> : "Visa"}
          </Button>

          <Button
            type="button"
            disabled={isCashSubmitting}
            onClick={handleCreateCashOrder}
          >
            {isCashSubmitting ? <Loader2 /> : "Cash"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
