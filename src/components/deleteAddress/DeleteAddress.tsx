"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Props = {
  id: string;
  token: string;
};

export default function DeleteAddressButton({ id, token }: Props) {
  const router = useRouter();

  const [isDeletingAddress, setIsDeletingAddress] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  async function handleDeleteAddress() {
    try {
      setIsDeletingAddress(true);

      const loadingToastId = toast.loading("Removing address...");

      const deleteAddressResponse = await fetch(
        `https://ecommerce.routemisr.com/api/v1/addresses/${id}`,
        {
          method: "DELETE",
          headers: { token },
        }
      );

      const deleteAddressResult = await deleteAddressResponse.json();

      if (!deleteAddressResponse.ok) {
        toast.dismiss(loadingToastId);
        toast.error(deleteAddressResult?.message || "Failed to delete address");
        return;
      }

      toast.dismiss(loadingToastId);
      toast.success("Address removed successfully");

      setIsDialogOpen(false);
      router.refresh();
    } catch (err) {
      toast.error("Network error, please try again.");
    } finally {
      setIsDeletingAddress(false);
    }
  }

  return (
    <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant="destructive"
          className="w-full py-2 text-sm font-semibold rounded-xl"
          disabled={isDeletingAddress}
        >
          Remove
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent className="w-[92vw] max-w-md rounded-2xl p-6 sm:p-7">
        <AlertDialogHeader className="space-y-2">
          <AlertDialogTitle className="text-lg sm:text-xl font-bold">
            Delete Address?
          </AlertDialogTitle>

          <AlertDialogDescription className="text-sm sm:text-base leading-relaxed">
            This action cannot be undone. This will permanently remove the
            address.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
          <AlertDialogCancel
            disabled={isDeletingAddress}
            className="w-full sm:w-auto rounded-xl"
          >
            Cancel
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDeleteAddress}
            disabled={isDeletingAddress}
            className="w-full sm:w-auto rounded-xl bg-red-600 hover:bg-red-700"
          >
            {isDeletingAddress ? "Removing..." : "Yes, delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
