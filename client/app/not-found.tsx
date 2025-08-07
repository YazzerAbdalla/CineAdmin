"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const NotFound = () => {
  const pathname = usePathname();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      pathname
    );
  }, [pathname]);

  return (
    <div className="min-h-[calc(100vh-4.08rem)] flex items-center justify-center bg-gray-950">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gray-300">404</h1>
        <p className="text-xl  text-green-500 mb-4">Oops! Page not found</p>
        <Link href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
