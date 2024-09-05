import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ReviewsDtoCreate } from './dto/review.dto';
import { ReviewService } from './review.service';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @Header('Content-type', 'application/json')
  async createFeatures(@Body() reviewsDtoCreate: ReviewsDtoCreate) {
    return this.reviewService.create(reviewsDtoCreate);
  }

  @Get(':product')
  getAll(@Param('product') product: number) {
    return this.reviewService.findAll(product);
  }
}
