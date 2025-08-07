import { Comment } from 'src/comment/entities/comment.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { Trend } from 'src/trends/entities/trend.entity';
import { IMovie } from 'src/types/movie';
import { User } from 'src/user/entities/user.entity';

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
  DeleteDateColumn,
} from 'typeorm';

@Entity('movies')
@Index(['title'])
@Index(['genre'])
@Index(['releaseDate'])
@Index(['ratingAvg'])
@Index(['authorId'])
export class Movie implements IMovie {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'text', array: true })
  genre: string[];

  @Column({ name: 'release_date', type: 'date' })
  releaseDate: Date;

  @Column({ type: 'int' })
  duration: number;

  @Column({ name: 'poster_url', length: 500, nullable: true })
  posterUrl?: string;

  @Column({ type: 'varchar', name: 'trailer_url', length: 500, nullable: true })
  trailerUrl?: string | null;

  @Column({ name: 'author_id' })
  authorId: number;

  @Column({ name: 'rating_avg', default: 0 })
  ratingAvg: number;

  @Column({ name: 'rating_count', default: 0 })
  ratingCount: number;

  @Column({ type: 'boolean', default: null, nullable: true })
  approved?: boolean | null;

  // Lazy-loaded relationships
  @ManyToOne(() => User, (user) => user.movies, {
    onDelete: 'NO ACTION',
    lazy: true,
  })
  @JoinColumn({ name: 'author_id' })
  author: Promise<User>;

  @OneToMany(() => Rating, (rating) => rating.movie, { lazy: true })
  ratings: Promise<Rating[]>;

  @OneToMany(() => Comment, (comment) => comment.movie, { lazy: true })
  comments: Promise<Comment[]>;

  @Column({ default: 0, type: 'int' })
  popularity: number;

  @OneToMany(() => Trend, (trend) => trend.movie)
  trends: Trend[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
