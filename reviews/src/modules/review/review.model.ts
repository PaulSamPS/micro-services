import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({ tableName: 'reviews' })
export class ReviewModel extends Model<ReviewModel> {
  @Column({ type: DataType.INTEGER })
  userId: number;

  @Column({ type: DataType.INTEGER })
  productId: number;

  @Column
  firstName: string;

  @Column
  lastName: string;

  @Column({ type: DataType.INTEGER, defaultValue: 5 })
  rating: number;

  @Column({ type: DataType.TEXT })
  review: string;

  @Column({ defaultValue: false })
  approved: boolean;
}
