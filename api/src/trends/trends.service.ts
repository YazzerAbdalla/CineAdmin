import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTrendDto } from './dto/create-trend.dto';
import { Trend } from './entities/trend.entity';

@Injectable()
export class TrendsService {
  constructor(
    @InjectRepository(Trend)
    private readonly trendRepository: Repository<Trend>,
  ) {}

  async create(createTrendDto: CreateTrendDto): Promise<Trend> {
    try {
      // find trend by search term
      let trend = await this.trendRepository.findOne({
        where: { searchTerm: createTrendDto.searchTerm },
      });
      if (trend) {
        trend.count += 1;
      } else {
        trend = this.trendRepository.create(createTrendDto);
      }
      return await this.trendRepository.save(trend);
    } catch (error) {
      console.error('Unexpected error while create trend sheet.', error);
      throw new InternalServerErrorException('Failed to create trend');
    }
  }

  async findAll(): Promise<Trend[]> {
    try {
      return await this.trendRepository.find({
        relations: ['movie'], // if you want to load movie details
        order: { count: 'DESC' },
        take: 5,
      });
    } catch (error) {
      console.error('Unexpected error while retrieve all trends sheets', error);

      throw new InternalServerErrorException('Failed to fetch trends');
    }
  }
}
