"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IMovie } from "@/types/movies";
import { fetchTrendingMovies } from "@/api/movie-services";
import { useQuery } from "@tanstack/react-query";
import Error from "./Error";

// Reusable UI Components
const MovieBadge = ({ label }: { label: string }) => (
  <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full backdrop-blur-sm">
    {label}
  </span>
);

const SlideIndicator = ({
  isActive,
  onClick,
}: {
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    className={`w-3 h-3 rounded-full transition-all duration-300 ${
      isActive ? "bg-green-500 w-8" : "bg-white/30 hover:bg-white/50"
    }`}
    onClick={onClick}
    type="button"
    aria-label={isActive ? "Current slide" : "Go to slide"}
  />
);

const NavButton = ({
  onClick,
  position,
  children,
}: {
  onClick: () => void;
  position: "left" | "right";
  children: React.ReactNode;
}) => (
  <Button
    variant="ghost"
    size="sm"
    className={`absolute ${position}-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm rounded-full w-12 h-12`}
    onClick={onClick}
    type="button"
    aria-label={position === "left" ? "Previous slide" : "Next slide"}
  >
    {children}
  </Button>
);

const HeroSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  const {
    data: movies = [],
    isLoading: loading,
    isError,
    refetch, // Add refetch function
  } = useQuery<IMovie[], Error>({
    queryKey: ["trending-movies"],
    queryFn: fetchTrendingMovies,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });

  const nextSlide = useCallback(() => {
    if (movies.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }
  }, [movies.length]);

  const prevSlide = useCallback(() => {
    if (movies.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    }
  }, [movies.length]);

  useEffect(() => {
    if (!autoPlay || movies.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, nextSlide, movies.length]);

  // Reset current index if it exceeds movies array length
  useEffect(() => {
    if (movies.length > 0 && currentIndex >= movies.length) {
      setCurrentIndex(0);
    }
  }, [movies.length, currentIndex]);

  const currentMovie = movies[currentIndex];

  // Loading state
  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center rounded-2xl bg-gray-900">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="text-white text-lg">Loading trending movies...</p>
        </div>
      </div>
    );
  }

  // Error handling function
  const handleRetry = async () => {
    try {
      await refetch();
    } catch (err) {
      console.error("Failed to refetch:", err);
    }
  };

  // Error state - show when there's an error OR when no movies are available
  if (isError || !currentMovie || movies.length === 0) {
    return (
      <div className="h-[70vh] flex items-center justify-center rounded-2xl">
        <Error
          title={isError ? "Failed to Load Movies" : "No Movies Available"}
          message={
            isError
              ? "We were unable to fetch trending movies from the server. Please check your connection and try again."
              : "No trending movies are currently available. Please check back later."
          }
          onRetry={handleRetry}
        />
      </div>
    );
  }

  return (
    <div
      className="relative h-[70vh] overflow-hidden rounded-2xl"
      onMouseEnter={() => setAutoPlay(false)}
      onMouseLeave={() => setAutoPlay(true)}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={currentMovie.posterUrl}
          alt={currentMovie.title}
          className="object-contain w-full h-full"
          width={1200}
          height={675}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          onError={() => {
            console.error(`Failed to load image: ${currentMovie.posterUrl}`);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-2xl">
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {currentMovie.genre?.map((g, index) => (
                  <MovieBadge key={`${g}-${index}`} label={g} />
                )) ?? null}
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
                {currentMovie.title}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">
                    {currentMovie.ratingAvg != null
                      ? currentMovie.ratingAvg.toFixed(1)
                      : "N/A"}
                  </span>
                </div>
                <span className="text-gray-300">
                  {new Date(currentMovie.releaseDate).getFullYear()}
                </span>
              </div>

              <p className="text-gray-200 text-lg mb-8 leading-relaxed line-clamp-3">
                {currentMovie.description}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 hover:scale-105"
              >
                <Link
                  href={`/movie/${currentMovie.id}`}
                  className="flex items-center"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Trailer
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-full font-semibold backdrop-blur-sm"
              >
                <Link href={`/movie/${currentMovie.id}`}>More Info</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation - Only show if there are multiple movies */}
      {movies.length > 1 && (
        <>
          <NavButton onClick={prevSlide} position="left">
            <ChevronLeft className="w-6 h-6" />
          </NavButton>

          <NavButton onClick={nextSlide} position="right">
            <ChevronRight className="w-6 h-6" />
          </NavButton>

          {/* Slide Indicators */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
            {movies.map((_, index) => (
              <SlideIndicator
                key={`slide-${index}`}
                isActive={index === currentIndex}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroSlider;
