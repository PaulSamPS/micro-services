import { Controller } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { IQuery } from './review.interface';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateReviewDto } from './dto/create-review.dto';

@Controller()
export class ReviewController {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  @EventPattern('create_review')
  async createFeatures(@Payload() createReviewDto: CreateReviewDto) {
    return await this.reviewRepository.create(createReviewDto);
  }

  @EventPattern('get_all_product_reviews')
  async getAll(@Payload() data: { productId: number; query: IQuery }) {
    return await this.reviewRepository.findAll(data.productId, data.query);
  }
}
