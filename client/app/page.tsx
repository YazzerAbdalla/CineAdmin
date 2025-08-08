"use client";
import HeroSlider from "@/components/heroSlider";
import MoviesFilterContainer from "@/components/MoviesFilterContainer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Hero Section */}
      <QueryClientProvider client={queryClient}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <HeroSlider />
        </div>
        <MoviesFilterContainer />
      </QueryClientProvider>
    </div>
  );
}
