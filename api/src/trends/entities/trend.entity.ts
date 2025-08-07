import { Movie } from 'src/movie/entities/movie.entity';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('trends')
@Index(['searchTerm'])
export class Trend {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'search_term' })
  searchTerm: string;

  @Column({ default: 1 })
  count: number;

  @Column({ name: 'poster_url' })
  posterUrl: string;

  @ManyToOne(() => Movie, (movie) => movie.trends, { onDelete: 'CASCADE' })
  movie: Movie;

  @Column({ name: 'movie_id' })
  movieId: number;
}
