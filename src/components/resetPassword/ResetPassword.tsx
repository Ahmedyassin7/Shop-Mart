"use client";

import React, { useState } from "react";
import toast from "react-hot-toast";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  triggerText?: string;
};

const resetPasswordModalSchema = z
  .object({
    newPassword: z
      .string()
      .nonempty("new password is required")
      .min(8, "password must be at least 8 characters")
      .max(20, "password must be at most 20 characters")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
      ),
    confirmPassword: z.string().nonempty("confirm password is required"),
  })
  .refine((formData) => formData.newPassword === formData.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPasswordModalFormValues = z.infer<typeof resetPasswordModalSchema>;

export default function ResetPasswordModal({
  triggerText = "Reset Password",
}: Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const resetPasswordForm = useForm<ResetPasswordModalFormValues>({
    resolver: zodResolver(resetPasswordModalSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const isSubmittingReset = resetPasswordForm.formState.isSubmitting;

  async function handleResetPasswordSubmit(
    values: ResetPasswordModalFormValues
  ) {
    const storedEmail = sessionStorage.getItem("resetEmail");

    if (!storedEmail) {
      toast.error("No email found. Please start from Forgot Password.");
      return;
    }

    try {
      const resetPasswordResponse = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/resetPassword",
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: storedEmail,
            newPassword: values.newPassword,
          }),
        }
      );

      const resetPasswordResult = await resetPasswordResponse.json();

      if (!resetPasswordResponse.ok) {
        toast.error(resetPasswordResult?.message || "Reset password failed");
        return;
      }

      toast.success("Password reset successfully ");

      sessionStorage.removeItem("resetEmail");
      sessionStorage.removeItem("resetVerified");

      resetPasswordForm.reset();
      setIsDialogOpen(false);

      router.push("/login");
    } catch {
      toast.error("Network error, try again");
    }
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">{triggerText}</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Reset Password</DialogTitle>
          <DialogDescription>Enter your new password below.</DialogDescription>
        </DialogHeader>

        <Form {...resetPasswordForm}>
          <form
            onSubmit={resetPasswordForm.handleSubmit(handleResetPasswordSubmit)}
            className="space-y-6 mt-4"
          >
            <FormField
              control={resetPasswordForm.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="New Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={resetPasswordForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm Password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              disabled={isSubmittingReset}
              className="w-full"
              type="submit"
            >
              {isSubmittingReset ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Saving...
                </span>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
