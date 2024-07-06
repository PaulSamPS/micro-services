import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { IImg, IProduct } from './products.interface';

@Table({ tableName: 'products' })
export class ProductsModel extends Model implements IProduct {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  id: number;

  @Column({ type: DataType.STRING, allowNull: false, unique: true })
  name: string;

  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  discount: number;

  @Column({ type: DataType.JSONB, allowNull: false })
  images: IImg[];

  @Column({ type: DataType.INTEGER, defaultValue: 0 })
  old_price: number;

  @Column({ type: DataType.INTEGER })
  price: number;

  @Column({ type: DataType.FLOAT, defaultValue: null })
  rating: number;
}
