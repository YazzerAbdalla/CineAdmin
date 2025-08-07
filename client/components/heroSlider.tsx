"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { IMovie } from "@/types/movies";
import { fetchTrendingMovies } from "@/api/movie-services";

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
  >
    {children}
  </Button>
);

const HeroSlider = () => {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [loading, setLoading] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
  }, [movies.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
  }, [movies.length]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await fetchTrendingMovies();
        setMovies(result || []);
      } catch (err) {
        console.error("Failed to fetch trending movies", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!autoPlay || movies.length === 0) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [autoPlay, nextSlide, movies]);

  const currentMovie = movies[currentIndex];

  if (loading || !currentMovie) {
    return (
      <div className="h-[30vh] flex items-center justify-center text-white text-xl">
        Loading...
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
          className="object-contain"
          width={1200}
          height={675}
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
                {currentMovie.genre?.map((g) => (
                  <MovieBadge key={g} label={g} />
                ))}
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
                {currentMovie.title}
              </h1>

              <div className="flex items-center space-x-4 mb-6">
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-white font-medium">
                    {currentMovie.ratingAvg?.toFixed(1) ?? "N/A"}
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

      {/* Navigation */}
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
            key={index}
            isActive={index === currentIndex}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;
