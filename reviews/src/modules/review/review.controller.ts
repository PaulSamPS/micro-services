import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { CreateReviewDto } from './dto/create-review.dto';
import { IPaginationQuery } from './pagination-query.interface';
import { ReviewService } from './review.service';

@Controller()
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @EventPattern('create_review')
  async createFeatures(@Payload() createReviewDto: CreateReviewDto) {
    return await this.reviewService.createReview(createReviewDto);
  }

  @EventPattern('get_all_product_reviews')
  async getAll(
    @Payload() data: { productId: number; query: IPaginationQuery },
  ) {
    return await this.reviewService.findReviews(data.productId, data.query);
  }
}
