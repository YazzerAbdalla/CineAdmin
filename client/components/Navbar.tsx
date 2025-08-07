"use client";
import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Film, Settings, LogOut, Home, User } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, error } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, []);

  return (
    <nav className=" backdrop-blur-lg border-b border-gray-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Film className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
              CineReview
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                isActive("/")
                  ? "bg-green-500/20 text-green-400"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>

            {user && user.userRole === "author" && (
              <Link
                href="/my-movies"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/my-movies")
                    ? "bg-green-500/20 text-green-400"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Film className="w-4 h-4" />
                <span>My Movies</span>
              </Link>
            )}

            {user && user.userRole === "admin" && (
              <Link
                href="/dashboard"
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-colors ${
                  isActive("/dashboard")
                    ? "bg-green-500/20 text-green-400"
                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user && user.userName.firstName ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-8 w-8 rounded-full"
                  >
                    <Avatar className="h-8 w-8 bg-gradient-to-r from-green-400 to-green-600">
                      <AvatarFallback className="bg-gradient-to-r from-green-400 to-green-600 text-white">
                        {user.userName.firstName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-gray-900 border-gray-800"
                >
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-white">
                      {user.userName.firstName + " " + user.userName.lastName}
                    </p>
                    <p className="text-xs text-gray-400">{user.userEmail}</p>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-800" />
                  <DropdownMenuItem
                    asChild
                    className="text-gray-300 hover:text-white hover:bg-gray-800"
                  >
                    <Link href="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  asChild
                  variant="ghost"
                  className="text-gray-300 hover:text-white"
                >
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button
                  asChild
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                >
                  <Link href="/register">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
