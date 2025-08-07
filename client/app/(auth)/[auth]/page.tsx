/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Film, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import NotFound from "../../not-found";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Link from "next/link";

interface Register {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name is required"),
    lastName: z.string().min(2, "Last name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const Auth = ({ params }: { params: Promise<{ auth: string }> }) => {
  const { login, register, error } = useAuth();
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleLogin = async (data: { email: string; password: string }) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success("Welcome back. You've been successfully logged in.");
      push("/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: Register) => {
    setIsLoading(true);
    try {
      const message = await register(
        data.firstName,
        data.lastName,
        data.email,
        data.password
      );
      if (typeof message === "string") toast.success(message);
      push("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!!error) {
      toast.error(error);
    }
  }, [error]);

  const { auth } = React.use(params);
  if (auth !== "login" && auth !== "register") return <NotFound />;

  return (
    <div className="min-h-[70dvh] bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl flex items-center justify-center">
              <Film className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              CineReview
            </span>
          </div>
          <p className="text-gray-400">Your gateway to movie reviews</p>
        </div>

        <Card className="bg-gray-900 border-gray-800">
          <Tabs defaultValue={auth} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-gray-800">
              <TabsTrigger
                value="login"
                className="data-[state=active]:bg-green-600"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger
                value="register"
                className="data-[state=active]:bg-green-600"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent className="md:p-6 pb-2" value="login">
              <CardHeader>
                <CardTitle className="text-white">Welcome back</CardTitle>
                <CardDescription className="text-gray-400">
                  Sign in to your account to continue
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={loginForm.handleSubmit(handleLogin)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      {...loginForm.register("email")}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <p className="text-sm text-red-500">
                      {loginForm.formState.errors.email?.message}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      {...loginForm.register("password")}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    <p className="text-sm text-red-500">
                      {loginForm.formState.errors.password?.message}
                    </p>
                  </div>

                  <div className="flex flex-col items-center gap-3">
                    <Button
                      type="submit"
                      className="w-full bg-green-600"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="animate-spin" />
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                    <Link href={"/forget-password"} className="text-blue-400 font-light" >
                      Forgotten password?
                    </Link>
                  </div>
                </form>
              </CardContent>
            </TabsContent>

            <TabsContent className="md:p-6 pb-2" value="register">
              <CardHeader>
                <CardTitle className="text-white">Create account</CardTitle>
                <CardDescription className="text-gray-400">
                  Join CineReview and start sharing your movie reviews
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={registerForm.handleSubmit(handleRegister)}
                  className="space-y-4"
                >
                  {[
                    ["firstName", "First Name"],
                    ["lastName", "Last Name"],
                    ["email", "Email"],
                    ["password", "Password"],
                    ["confirmPassword", "Confirm Password"],
                  ].map(([field, label]) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="text-white">
                        {label}
                      </Label>
                      <Input
                        id={field}
                        type={
                          field.toLowerCase().includes("password")
                            ? "password"
                            : "text"
                        }
                        placeholder={`Enter your ${label.toLowerCase()}`}
                        {...registerForm.register(field as any)}
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <p className="text-sm text-red-500">
                        {
                          registerForm.formState.errors[
                            field as keyof typeof registerForm.formState.errors
                          ]?.message as string
                        }
                      </p>
                    </div>
                  ))}
                  <Button
                    type="submit"
                    className="w-full bg-green-600"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="animate-spin" />
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
