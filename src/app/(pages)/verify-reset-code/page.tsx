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
import { Card } from "@/components/ui/card";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const verifyResetCodeSchema = z.object({
  resetCode: z
    .string()
    .nonempty("Reset code is required")
    .regex(/^\d{6}$/, "Reset code must be 6 digits"),
});

type VerifyResetCodeFormValues = z.infer<typeof verifyResetCodeSchema>;

export default function VerifyResetCodePage() {
  const router = useRouter();

  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  const verifyResetCodeForm = useForm<VerifyResetCodeFormValues>({
    resolver: zodResolver(verifyResetCodeSchema),
    defaultValues: { resetCode: "" },
  });

  const isSubmittingVerification = verifyResetCodeForm.formState.isSubmitting;

  async function handleVerifyResetCodeSubmit(values: VerifyResetCodeFormValues) {
    setApiErrorMessage(null);

    try {
      const verifyResponse = await fetch(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );

      const verifyResult = await verifyResponse.json();

      if (!verifyResponse.ok || verifyResult?.statusMsg === "fail") {
        const errorMessage = verifyResult?.message || "Invalid reset code";
        setApiErrorMessage(errorMessage);
        toast.error(errorMessage);
        return;
      }

      toast.success("Code verified ");

      sessionStorage.setItem("resetVerified", "true");

      router.push("/reset-password");
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
            Verify Reset Code
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code we sent to your email.
          </p>
        </div>

        {/* Card */}
        <Card className="p-6 sm:p-7 rounded-2xl border shadow-sm">
          <Form {...verifyResetCodeForm}>
            <form
              onSubmit={verifyResetCodeForm.handleSubmit(
                handleVerifyResetCodeSubmit
              )}
              className="space-y-5"
            >
              {apiErrorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {apiErrorMessage}
                </div>
              )}

              <FormField
                control={verifyResetCodeForm.control}
                name="resetCode"
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-sm font-medium">
                      Reset Code
                    </FormLabel>

                    <FormControl>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={field.value}
                          onChange={(otpValue) => {
                            field.onChange(otpValue);
                            if (otpValue.length === 6) {
                              verifyResetCodeForm.handleSubmit(
                                handleVerifyResetCodeSubmit
                              )();
                            }
                          }}
                        >
                          <InputOTPGroup className="gap-2">
                            <InputOTPSlot index={0} className="rounded-xl" />
                            <InputOTPSlot index={1} className="rounded-xl" />
                            <InputOTPSlot index={2} className="rounded-xl" />
                            <InputOTPSlot index={3} className="rounded-xl" />
                            <InputOTPSlot index={4} className="rounded-xl" />
                            <InputOTPSlot index={5} className="rounded-xl" />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                className="w-full h-11 rounded-xl font-semibold"
                disabled={isSubmittingVerification}
                type="submit"
              >
                {isSubmittingVerification ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={18} />
                    Verifying...
                  </span>
                ) : (
                  "Verify Code"
                )}
              </Button>
            </form>
          </Form>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive a code?{" "}
          <Link href="/forgot-password" className="text-blue-600 hover:underline">
            Send again
          </Link>
        </p>
      </div>
    </div>
  );
}
