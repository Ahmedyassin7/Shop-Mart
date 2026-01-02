"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .nonempty("email is required")
    .min(3, "email must be at least 3 characters")
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "invalid email"
    ),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const forgotPasswordForm = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const isSubmittingForm = forgotPasswordForm.formState.isSubmitting;

  async function handleForgotPasswordSubmit(values: ForgotPasswordFormValues) {
    setApiErrorMessage(null);

    try {
      const forgotPasswordResponse = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const forgotPasswordResult = await forgotPasswordResponse.json();

      if (
        !forgotPasswordResponse.ok ||
        forgotPasswordResult?.statusMsg === "error"
      ) {
        const errorMessage =
          forgotPasswordResult?.message || "Something went wrong";
        setApiErrorMessage(errorMessage);
        toast.error(errorMessage);
        return;
      }

      toast.success("Reset code sent to your email ");

      sessionStorage.setItem("resetEmail", values.email);

      router.push("/verify-reset-code");
    } catch (error) {
      setApiErrorMessage("Network error, try again");
      toast.error("Network error, try again");
    }
  }

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email and we&apos;ll send you a 6-digit reset code.
          </p>
        </div>

        
        <Card className="p-6 sm:p-7 rounded-2xl border shadow-sm">
          <Form {...forgotPasswordForm}>
            <form
              onSubmit={forgotPasswordForm.handleSubmit(
                handleForgotPasswordSubmit
              )}
              className="space-y-5"
            >
              {apiErrorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {apiErrorMessage}
                </div>
              )}

              <FormField
                control={forgotPasswordForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="name@example.com"
                        className="h-11 rounded-xl"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full h-11 rounded-xl font-semibold"
                disabled={isSubmittingForm}
                type="submit"
              >
                {isSubmittingForm ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Sending...
                  </span>
                ) : (
                  "Send Reset Code"
                )}
              </Button>
            </form>
          </Form>
        </Card>

        
        <p className="text-center text-sm text-muted-foreground">
          Remember your password?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
