import { Injectable } from '@nestjs/common';
import { ReviewModel } from './review.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewRepository {
  constructor(
    @InjectModel(ReviewModel)
    private readonly reviewModel: typeof ReviewModel,
  ) {}

  async findByProductIdAndUserId(productId: number, userId: number) {
    return this.reviewModel.findOne({ where: { productId, userId } });
  }

  async save(review: CreateReviewDto) {
    return this.reviewModel.create(review);
  }

  async findByProductId(productId: number, limit: number, offset: number) {
    return this.reviewModel.findAndCountAll({
      where: { productId, approved: true },
      limit,
      offset,
      order: [['rating', 'DESC']],
    });
  }
}
