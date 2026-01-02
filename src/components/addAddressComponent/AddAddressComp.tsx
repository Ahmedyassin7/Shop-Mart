"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";

type Props = {
  token: string;
};

export default function AddAddressComp({ token }: Props) {
  const router = useRouter();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmittingAddress, setIsSubmittingAddress] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState("");

  const [addressFormValues, setAddressFormValues] = useState({
    name: "",
    details: "",
    phone: "",
    city: "",
  });

  function handleAddressInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setAddressFormValues({
      ...addressFormValues,
      [e.target.name]: e.target.value,
    });
  }

  async function handleAddAddressSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormErrorMessage("");

    if (
      !addressFormValues.name ||
      !addressFormValues.details ||
      !addressFormValues.phone ||
      !addressFormValues.city
    ) {
      setFormErrorMessage("Please fill all fields.");
      return;
    }

    try {
      setIsSubmittingAddress(true);

      const createAddressResponse = await fetch(
        "https://ecommerce.routemisr.com/api/v1/addresses",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify(addressFormValues),
        }
      );

      const createAddressResult = await createAddressResponse.json();

      if (!createAddressResponse.ok) {
        setFormErrorMessage(
          createAddressResult?.message || "Something went wrong"
        );
        return;
      }

      setAddressFormValues({ name: "", details: "", phone: "", city: "" });
      setIsDialogOpen(false);
      router.refresh();
    } catch (err: any) {
      setFormErrorMessage("Network error. Please try again.");
    } finally {
      setIsSubmittingAddress(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="px-6 py-2 font-semibold">+ Add New Address</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Add New Address
          </DialogTitle>
          <DialogDescription>
            Save a new address for future use.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAddAddressSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Address Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Home"
              value={addressFormValues.name}
              onChange={handleAddressInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="details">Details</Label>
            <Input
              id="details"
              name="details"
              placeholder="Street, Building, Apartment..."
              value={addressFormValues.details}
              onChange={handleAddressInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              placeholder="01xxxxxxxxx"
              value={addressFormValues.phone}
              onChange={handleAddressInputChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              placeholder="Giza"
              value={addressFormValues.city}
              onChange={handleAddressInputChange}
            />
          </div>

          {formErrorMessage && (
            <p className="text-sm font-semibold text-red-600">
              {formErrorMessage}
            </p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmittingAddress}
              className="sm:flex-1"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isSubmittingAddress}
              className="sm:flex-1"
            >
              {isSubmittingAddress ? "Adding..." : "Save Address"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
