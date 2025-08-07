/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { resetUserPassword } from "@/api/auth-service";

const schema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Must include at least one uppercase letter")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(/[^A-Za-z0-9]/, "Must include at least one special character"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword({
  params,
}: {
  params: Promise<{ userId: number; resetToken: string }>;
}) {
  const { push } = useRouter();
  const [loading, setLoading] = useState(false);
  const { userId, resetToken } = use(params);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const handleSubmit = async (data: {
    password: string;
    confirmPassword: string;
  }) => {
    setLoading(true);
    try {
      // Replace with your API call
      if (!userId || !resetToken) {
        throw new Error("Invalid reset token");
      }
      await resetUserPassword(data.password, resetToken, userId);
      toast.success("Password reset successfully. Please login.");
      push("/login");
    } catch (error: any) {
      console.error("Failed to reset your password, ", error.message);

      // FIXME: toast doesn't appear here to user
      if (typeof error.message === "object") {
        toast.error(error.message[0]);
      } else {
        const errorMsg = error.message || "Failed to reset password.";
        toast.error(errorMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70dvh] bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              Reset Password
            </span>
          </div>
          <p className="text-gray-400">
            Choose a new password to regain access
          </p>
        </div>

        <Card className="bg-gray-900 border-gray-800 py-8">
          <CardHeader>
            <CardTitle className="text-white">Create a new password</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {(["password", "confirmPassword"] as const).map((field) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field} className="text-white capitalize">
                    {field === "confirmPassword"
                      ? "Confirm Password"
                      : "New Password"}
                  </Label>
                  <Input
                    id={field}
                    type="password"
                    placeholder={`Enter your ${field}`}
                    {...form.register(field)}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                  <p className="text-sm text-red-500">
                    {
                      form.formState.errors[
                        field as keyof typeof form.formState.errors
                      ]?.message as string
                    }
                  </p>
                </div>
              ))}

              <Button
                type="submit"
                className="w-full bg-green-600"
                disabled={loading}
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
