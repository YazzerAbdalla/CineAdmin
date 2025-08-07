import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { IMovie } from "@/types/movies";

const MovieCard: React.FC<IMovie> = ({
  id,
  title,
  posterUrl,
  ratingAvg,
  ratingCount,
  genre,
  releaseDate,
}) => {
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? "text-yellow-400 fill-yellow-400"
            : "text-gray-400"
        }`}
      />
    ));
  };

  return (
    <Link href={`/movie/${id}`}>
      <Card className="bg-gray-900 border-gray-800 hover:border-green-500/50 max-h-[600px] transition-all duration-300 group cursor-pointer">
        <div className="aspect-[2/3] overflow-hidden rounded-t-lg">
          <Image
            width={500}
            height={2000}
            src={posterUrl}
            loading="lazy"
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <CardContent className="p-4">
          <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-green-400 transition-colors">
            {title}
          </h3>

          <div className="flex items-center space-x-1 mb-3">
            {renderStars(ratingAvg)}
            <span className="text-white text-sm ml-2">
              {ratingAvg.toFixed(1)}
            </span>
            <span className="text-gray-400 text-sm">({ratingCount})</span>
          </div>

          <div className="flex flex-wrap gap-1 mb-3">
            {genre.slice(0, 2).map((g) => (
              <Badge
                key={g}
                variant="secondary"
                className="text-xs bg-green-500/20 text-green-400 border-green-500/30"
              >
                {g}
              </Badge>
            ))}
          </div>

          <div className="flex items-center text-gray-400 text-sm">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(releaseDate).getFullYear()}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
