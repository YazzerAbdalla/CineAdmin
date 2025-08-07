import { Movie } from 'src/movie/entities/movie.entity';
import { IComment } from 'src/types/comment';
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
  DeleteDateColumn,
} from 'typeorm';

@Entity('comments')
@Index(['userId'])
@Index(['movieId'])
@Index(['createdAt'])
export class Comment implements IComment {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'movie_id' })
  movieId: number;

  @Column({ type: 'text' })
  content: string;

  // Lazy-loaded relationships
  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: Promise<User>;

  @ManyToOne(() => Movie, (movie) => movie.comments, {
    onDelete: 'CASCADE',
    lazy: true,
  })
  @JoinColumn({ name: 'movie_id' })
  movie: Promise<Movie>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
