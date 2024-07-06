import { IImg, IProduct } from '../products.interface';

export class CreateProductDto implements IProduct {
  description: string;
  discount: number;
  images: IImg[];
  name: string;
  old_price: number;
  price: number;
  rating: number;
}
