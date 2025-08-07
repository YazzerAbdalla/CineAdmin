import { Movie } from 'src/movie/entities/movie.entity';
import { IRating } from 'src/types/rating';
import { User } from 'src/user/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
  Check,
} from 'typeorm';

@Entity('ratings')
@Unique(['userId', 'movieId'])
@Index(['userId'])
@Index(['movieId'])
@Index(['rating'])
@Check('"rating" >= 1.0 AND "rating" <= 5.0')
export class Rating implements IRating {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'movie_id' })
  movieId: number;

  @Column({
    type: 'decimal',
    precision: 2,
    scale: 1,
    transformer: {
      to: (value: number) => value,
      from: (value: string) => parseFloat(value),
    },
  })
  rating: number;

  // Lazy-loaded relationships
  @ManyToOne(() => User, (user) => user.ratings, {
    onDelete: 'NO ACTION',
    lazy: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @ManyToOne(() => Movie, (movie) => movie.ratings, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  @JoinColumn({ name: 'movie_id' })
  movie: Promise<Movie>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
