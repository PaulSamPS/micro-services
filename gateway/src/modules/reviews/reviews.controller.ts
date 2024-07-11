import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { REVIEWS_SERVICE } from './constants';
import { CreateReviewDto } from './create-review.dto';
import { ErrorInterceptor } from '../../interceptors/error-interceptor';
import { IQuery } from './review.interface';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { lastValueFrom } from 'rxjs';

@Controller('reviews')
export class ReviewsController {
  constructor(@Inject(REVIEWS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(ErrorInterceptor)
  async create(@Body() createReviewDto: CreateReviewDto) {
    return await lastValueFrom(
      this.client.send('create_review', createReviewDto),
    );
  }

  @Get(':productId')
  @UseInterceptors(ErrorInterceptor)
  async getAll(@Param('productId') productId: number, @Query() query: IQuery) {
    return await lastValueFrom(
      this.client.send('get_all_product_reviews', { productId, query }),
    );
  }
}
