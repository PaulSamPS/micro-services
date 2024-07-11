import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateReviewDto {
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
