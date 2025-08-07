import { Controller, Get, Post, Body } from '@nestjs/common';
import { TrendsService } from './trends.service';
import { CreateTrendDto } from './dto/create-trend.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { Trend } from './entities/trend.entity';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Trends')
@Throttle({ default: { limit: 1000, ttl: 6000 } })
@Controller('trends')
export class TrendsController {
  constructor(private readonly trendsService: TrendsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trend or update existed trend' })
  @ApiCreatedResponse({
    description: 'Trend successfully created',
    type: Trend,
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  create(@Body() createTrendDto: CreateTrendDto) {
    return this.trendsService.create(createTrendDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all trends' })
  @ApiResponse({
    status: 200,
    description: 'List of all trends',
    type: [Trend],
  })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  findAll() {
    return this.trendsService.findAll();
  }
}
