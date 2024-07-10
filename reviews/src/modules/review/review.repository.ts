import { ReviewModel } from './review.model';
import { InjectModel } from '@nestjs/sequelize';
import { HttpStatus } from '@nestjs/common';
import { IQuery } from './review.interface';
import { RpcException } from '@nestjs/microservices';
import { CreateReviewDto } from './dto/create-review.dto';

export class ReviewRepository {
  constructor(
    @InjectModel(ReviewModel) private readonly reviewsModel: typeof ReviewModel,
  ) {}

  async create(createReviewDto: CreateReviewDto) {
    if (!createReviewDto) {
      throw new RpcException({
        message: 'Не переденны нужные данные',
        status: HttpStatus.CONFLICT,
      });
    }

    const { productId, userId, firstName, lastName, rating, text } =
      createReviewDto;

    // Проверяем, оставлял ли пользователь уже отзыв о данном товаре
    const existingReview = await this.reviewsModel.findOne({
      where: { productId, userId },
    });

    if (existingReview) {
      throw new RpcException({
        message: 'Вы уже оставляли отзыв о данном товаре',
        status: HttpStatus.CONFLICT,
      });
    }

    try {
      // Создаем новый отзыв
      await this.reviewsModel.create({
        userId,
        productId,
        firstName,
        lastName,
        rating,
        text,
        approved: false,
      });
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

  async findAll(productId: number, query: IQuery) {
    const limit = +query.limit || 10;
    const offset = +query.offset || 0;

    const reviews = await this.reviewsModel.findAndCountAll({
      where: { productId },
      limit,
      offset,
      order: [['rating', 'DESC']],
    });

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
