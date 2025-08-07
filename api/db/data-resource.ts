import { Comment } from '../src/comment/entities/comment.entity';
import { Movie } from '../src/movie/entities/movie.entity';
import { Rating } from '../src/rating/entities/rating.entity';
import { User } from '../src/user/entities/user.entity';
import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: '',
  entities: [User, Comment, Movie, Rating],
  migrations: ['dist/db/migrations/*.js', 'db/migrations/*.ts'],
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
