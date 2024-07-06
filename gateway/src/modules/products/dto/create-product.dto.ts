import { IProduct } from '../products.interface';

export class CreateProductDto implements Omit<IProduct, 'images' | 'id'> {
  description: string;
  discount: number;
  name: string;
  old_price: number;
  price: number;
  rating: number;
}
