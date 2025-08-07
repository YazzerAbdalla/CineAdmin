/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpService } from '@nestjs/axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { TmbdDataResultProps } from 'src/types/tmdbDataResult';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MovieSeedService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Movie)
    private readonly movieRepository: Repository<Movie>,
  ) {}

  async fetchMoviesFromTmdb() {
    const apiKey =
      'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIzYjUzNmU3NGYyMWIxZTllM2EyOTJhNWM4MjU2ODdmYSIsIm5iZiI6MTcyNjMyNTQzMS44OTQsInN1YiI6IjY2ZTVhMmI3ZjNkM2Y4YmZmOTZkOWE0MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.1Fef2Og5frUAyjaXvaaEzJHNLCqhtFN6vtAnNABPgkg'; // keep this private
    const baseUrl = 'https://api.themoviedb.org/3';

    try {
      // Step 1: Search for the movie
      // const searchResponse = await firstValueFrom(
      //   this.httpService.get(
      //     `${baseUrl}/search/movie?query=${encodeURIComponent(movieTitle)}`,
      //     {
      //       headers: { Authorization: `Bearer ${apiKey}` },
      //     },
      //   ),
      // );
      const searchResponse = await firstValueFrom(
        this.httpService.get(`${baseUrl}/movie/top_rated`, {
          headers: { Authorization: `Bearer ${apiKey}` },
        }),
      );
      const data: TmbdDataResultProps = searchResponse.data;

      const searchResults = data.results;

      for (const result of searchResults) {
        const movieId = result.id;

        // Step 2: Get full movie details
        const detailResponse = await firstValueFrom(
          this.httpService.get(`${baseUrl}/movie/${movieId}`, {
            headers: { Authorization: `Bearer ${apiKey}` },
          }),
        );

        const movie = detailResponse.data;

        const newMovie = this.movieRepository.create({
          title: movie.title,
          description: movie.overview,
          genre: movie.genres.map((g: { name: string }) => g.name), // Array of genre strings
          releaseDate: movie.release_date,
          duration: movie.runtime,
          posterUrl: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          trailerUrl: 'there is no trailer.', // You can get trailer separately
          authorId: 1,
          ratingAvg: parseInt(movie.vote_average),
          ratingCount: parseInt(movie.vote_count),
          approved: true,
        });

        await this.movieRepository.save(newMovie);
      }

      return `Imported ${searchResults.length} movies`;
    } catch (error) {
      console.error(
        '❌ TMDb Import Error:',
        error?.response?.data || error.message,
      );
      throw new InternalServerErrorException('Failed to fetch from TMDb');
    }
  }
}
