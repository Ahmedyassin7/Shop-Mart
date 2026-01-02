"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {
  token: string;
};

const changePasswordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .nonempty("current password is required")
      .min(6, "current password must be at least 6 characters"),

    password: z
      .string()
      .nonempty("new password is required")
      .min(8, "password must be at least 8 characters")
      .max(20, "password must be at most 20 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),

    rePassword: z.string().nonempty("confirm password is required"),
  })
  .refine((formData) => formData.password === formData.rePassword, {
    message: "Passwords do not match",
    path: ["rePassword"],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordFormSchema>;

export default function ChangePasswordModal({ token }: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const [passwordVisibility, setPasswordVisibility] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordFormSchema),
    defaultValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
  });

  const isSubmittingChange = changePasswordForm.formState.isSubmitting;

  async function handleChangePasswordSubmit(values: ChangePasswordFormValues) {
    try {
      const changePasswordResponse = await fetch(
        "https://ecommerce.routemisr.com/api/v1/users/changeMyPassword",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            token,
          },
          body: JSON.stringify(values),
        }
      );

      const changePasswordResult = await changePasswordResponse.json();

      if (!changePasswordResponse.ok) {
        toast.error(changePasswordResult?.message || "Something went wrong");
        return;
      }

      toast.success("Password changed Successfully, Please login again");

      setIsDialogOpen(false);
      changePasswordForm.reset();

      await signOut({ redirect: false });
      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error("Network error, try again");
    }
  }

  const PasswordField = ({
    field,
    placeholder,
    isShown,
    toggle,
  }: {
    field: any;
    placeholder: string;
    isShown: boolean;
    toggle: () => void;
  }) => (
    <div className="relative">
      <Input
        type={isShown ? "text" : "password"}
        placeholder={placeholder}
        {...field}
        className="pr-10"
      />

      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black"
      >
        {isShown ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="font-semibold">
          Change Password
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Update your account password securely.
          </DialogDescription>
        </DialogHeader>

        <Form {...changePasswordForm}>
          <form
            onSubmit={changePasswordForm.handleSubmit(handleChangePasswordSubmit)}
            className="space-y-6 mt-4"
          >
            <FormField
              control={changePasswordForm.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <PasswordField
                      field={field}
                      placeholder="Current Password"
                      isShown={passwordVisibility.current}
                      toggle={() =>
                        setPasswordVisibility((prev) => ({
                          ...prev,
                          current: !prev.current,
                        }))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={changePasswordForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <PasswordField
                      field={field}
                      placeholder="New Password"
                      isShown={passwordVisibility.newPass}
                      toggle={() =>
                        setPasswordVisibility((prev) => ({
                          ...prev,
                          newPass: !prev.newPass,
                        }))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={changePasswordForm.control}
              name="rePassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <PasswordField
                      field={field}
                      placeholder="Confirm New Password"
                      isShown={passwordVisibility.confirm}
                      toggle={() =>
                        setPasswordVisibility((prev) => ({
                          ...prev,
                          confirm: !prev.confirm,
                        }))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isSubmittingChange} className="w-full">
              {isSubmittingChange ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Updating...
                </span>
              ) : (
                "Save Password"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
