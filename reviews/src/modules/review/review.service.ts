import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { ReviewModel } from './review.model';
import { ReviewsDtoCreate } from './dto/review.dto';
import axios, { AxiosResponse } from 'axios';
import { RpcException } from '@nestjs/microservices';
import { IProduct } from './products.interface';

@Injectable()
export class ReviewService {
  constructor(
    @InjectModel(ReviewModel)
    private reviewsModel: typeof ReviewModel,
  ) {}

  async topProducts() {
    return await this.reviewsModel.findAll({
      where: { rating: { [Op.gt]: 4 } },
    });
  }

  async findAll(product: number) {
    const reviews = await this.fetchReviews(product);

    if (!reviews) {
      return this.noReviewsFoundResponse();
    }

    const { count, rows } = reviews;
    const averageRating = this.calculateRating(rows, count);
    const sortedReviews = this.sortReviewsByRating(rows);

    return { sortedReviews, count, averageRating };
  }

  private async fetchReviews(productId: number) {
    return await this.reviewsModel.findAndCountAll({ where: { productId } });
  }

  private noReviewsFoundResponse() {
    return {
      message: 'Пока еще никто не оставил отзыв',
      status: HttpStatus.CONFLICT,
    };
  }

  private calculateRating(reviews: ReviewModel[], count: number) {
    const totalRating = reviews.reduce((sum, item) => sum + item.rating, 0);
    return (totalRating / count).toFixed(1);
  }

  private sortReviewsByRating(reviews: ReviewModel[]) {
    return reviews.sort((a, b) => b.rating - a.rating);
  }
}
