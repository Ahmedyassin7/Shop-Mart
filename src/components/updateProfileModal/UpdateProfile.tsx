"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  token: string;
  defaultValues?: {
    name?: string;
    email?: string;
    phone?: string;
  };
};

export default function UpdateProfileDialog({ token, defaultValues }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);

  const router = useRouter();

  const [profileFormValues, setProfileFormValues] = useState({
    name: defaultValues?.name || "",
    email: defaultValues?.email || "",
    phone: defaultValues?.phone || "",
  });

  function handleProfileInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setProfileFormValues({
      ...profileFormValues,
      [e.target.name]: e.target.value,
    });
  }

  async function handleProfileUpdateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmittingUpdate(true);

    try {
      const updateProfileResponse = await fetch(
        "https://ecommerce.routemisr.com/api/v1/users/updateMe/",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify(profileFormValues),
        }
      );

      const updateProfileResult = await updateProfileResponse.json();

      if (!updateProfileResponse.ok) {
        toast.error(updateProfileResult?.message || "Something went wrong");
        return;
      }

      toast.success("Profile updated successfully ");
      setIsDialogOpen(false);

      router.refresh();
    } catch (error) {
      toast.error("Network error, try again");
    } finally {
      setIsSubmittingUpdate(false);
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button className="font-semibold">Edit Profile</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile information (Name, Email, Phone).
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleProfileUpdateSubmit} className="space-y-5 mt-3">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={profileFormValues.name}
              onChange={handleProfileInputChange}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              value={profileFormValues.email}
              onChange={handleProfileInputChange}
              placeholder="Enter your new email"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={profileFormValues.phone}
              onChange={handleProfileInputChange}
              placeholder="Enter your phone"
              required
            />
          </div>

          <Button disabled={isSubmittingUpdate} className="w-full">
            {isSubmittingUpdate ? (
              <Loader2 className="animate-spin mt-2" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
