import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { IReview } from '../review.interface';

export class CreateReviewDto implements IReview {
  @IsBoolean()
  @IsOptional()
  approved: boolean;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  productId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  rating: number;

  @IsString()
  @IsNotEmpty()
  text: string;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  userId: number;
}
