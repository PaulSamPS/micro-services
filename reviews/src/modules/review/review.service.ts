import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { RpcException } from '@nestjs/microservices';
import { IPaginationQuery } from './pagination-query.interface';
import { ReviewRepository } from './review.repository';

@Injectable()
export class ReviewService {
  constructor(private readonly reviewRepository: ReviewRepository) {}

  async createReview(createReviewDto: CreateReviewDto) {
    const existingReview = await this.reviewRepository.findByProductIdAndUserId(
      createReviewDto.productId,
      createReviewDto.userId,
    );

    if (existingReview) {
      throw new RpcException({
        message: 'Вы уже оставляли отзыв о данном товаре',
        status: HttpStatus.CONFLICT,
      });
    }

    try {
      await this.reviewRepository.save(createReviewDto);

      return {
        message:
          'Отзыв будет опубликован после проверки модератором. Спасибо за отзыв',
      };
    } catch (error) {
      throw new RpcException({
        message: 'Внутренняя ошибка сервера при создании отзыва',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
      });
    }
  }

  async findReviews(productId: number, query: IPaginationQuery) {
    const limit = +query.limit || 10;
    const offset = +query.offset || 0;

    const reviews = await this.reviewRepository.findByProductId(
      productId,
      limit,
      offset,
    );

    if (reviews.rows.length <= 0) {
      throw new RpcException({
        message: 'Отзывы не найдены',
        status: HttpStatus.NOT_FOUND,
      });
    }

    const { count, rows } = reviews;

    return { reviews: rows, count };
  }
}
