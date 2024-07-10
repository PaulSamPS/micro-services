import { IReview } from './review.interface';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateReviewDto implements IReview {
  @IsBoolean({ message: 'approved должно быть boolean' })
  @IsOptional()
  approved: boolean;

  @IsString({ message: 'firstname должно быть строкой' })
  @IsNotEmpty({ message: 'firstname не должно быть пустым' })
  firstName: string;

  @IsString({ message: 'lastname должно быть строкой' })
  @IsNotEmpty({ message: 'lastName не должно быть пустым' })
  lastName: string;

  @IsInt({ message: 'productId должно быть числом' })
  @IsPositive({ message: 'productId должно быть положительным числом' })
  @IsNotEmpty({ message: 'productId не должно быть пустым' })
  productId: number;

  @IsInt({ message: 'rating должно быть числом' })
  @IsPositive({ message: 'rating должно быть положительным числом' })
  @IsNotEmpty({ message: 'rating не должно быть пустым' })
  rating: number;

  @IsString({ message: 'text должно быть строкой' })
  @IsNotEmpty({ message: 'text не должно быть пустым' })
  text: string;

  @IsInt({ message: 'userId должно быть числом' })
  @IsPositive({ message: 'userId должно быть положительным числом' })
  @IsNotEmpty({ message: 'userId не должно быть пустым' })
  userId: number;
}
