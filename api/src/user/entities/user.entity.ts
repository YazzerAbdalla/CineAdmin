// entities/User.entity.ts
import { Comment } from 'src/comment/entities/comment.entity';
import { Movie } from 'src/movie/entities/movie.entity';
import { Rating } from 'src/rating/entities/rating.entity';
import { IUser, UserRole } from 'src/types/user';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

@Entity('users')
export class User implements IUser {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true, length: 255 })
  email: string;

  @Column({ length: 255 })
  password: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ default: false })
  isEmailVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  verificationToken: string | null;

  @Column({ type: 'varchar', nullable: true })
  resetPasswordToken: string | null;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  // Lazy-loaded relationships to avoid circular dependency issues
  @OneToMany(() => Movie, (movie) => movie.author, { lazy: true })
  movies: Promise<Movie[]>;

  @OneToMany(() => Rating, (rating) => rating.user, { lazy: true })
  ratings: Promise<Rating[]>;

  @OneToMany(() => Comment, (comment) => comment.user, { lazy: true })
  comments: Promise<Comment[]>;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;
}
