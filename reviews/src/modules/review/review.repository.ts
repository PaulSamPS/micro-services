import { ReviewModel } from './review.model';
import { InjectModel } from '@nestjs/sequelize';
import { ReviewsDtoCreate } from './dto/review.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export class ReviewRepository {
  constructor(
    @InjectModel(ReviewModel) private readonly reviewsModel: typeof ReviewModel,
  ) {}

  async create(reviewsDtoCreate: ReviewsDtoCreate) {
    const { productId, userId, firstName, lastName, rating, review } =
      reviewsDtoCreate;

    // Проверяем, оставлял ли пользователь уже отзыв о данном товаре
    const existingReview = await this.reviewsModel.findOne({
      where: { productId, userId },
    });

    if (existingReview) {
      throw new HttpException(
        'Вы уже оставляли отзыв о данном товаре',
        HttpStatus.CONFLICT,
      );
    }

    try {
      // Создаем новый отзыв
      await this.reviewsModel.create({
        userId,
        productId,
        firstName,
        lastName,
        rating,
        review,
        approved: false,
      });
      return {
        message:
          'Отзыв будет опубликован после проверки модератором. Спасибо за отзыв',
      };
    } catch (error) {
      throw new HttpException(
        'Внутренняя ошибка сервера при создании отзыва',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
