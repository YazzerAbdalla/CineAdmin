import { Module } from '@nestjs/common';
import { TrendsService } from './trends.service';
import { TrendsController } from './trends.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Trend } from './entities/trend.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Trend])],
  controllers: [TrendsController],
  providers: [TrendsService],
})
export class TrendsModule {}
