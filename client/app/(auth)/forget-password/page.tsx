/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Film, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { forgotPasswordReq } from "@/api/auth-service";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: { email: string }) => {
    setIsLoading(true);
    try {
      await forgotPasswordReq(data.email);
      toast.success("Password reset link sent to your email.");
    } catch (err: any) {
      console.error(err);
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70dvh] bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
              <Film className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              CineReview
            </span>
          </div>
          <p className="text-gray-400">Request password reset</p>
        </div>

        {/* Form Card */}
        <Card className="bg-gray-900 border-gray-800 py-8">
          <CardHeader>
            <CardTitle className="text-white">Forgot Password</CardTitle>
            <CardDescription className="text-gray-400">
              Enter your email to receive a reset link
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...form.register("email")}
                  className="bg-gray-800 border-gray-700 text-white"
                />
                <p className="text-sm text-red-500">
                  {form.formState.errors.email?.message}
                </p>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
