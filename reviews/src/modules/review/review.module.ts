import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ReviewModel } from './review.model';
import { ReviewController } from './review.controller';
import { ReviewRepository } from './review.repository';

@Module({
  imports: [SequelizeModule.forFeature([ReviewModel])],
  providers: [ReviewRepository],
  controllers: [ReviewController],
})
export class ReviewModule {}
