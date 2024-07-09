import { IImg, IProduct } from './products.interface';

export class ProductsEntity implements IProduct {
  id?: number;
  description: string;
  discount: number;
  images: IImg[];
  name: string;
  old_price: number;
  price: number;
  rating: number;

  constructor(product: IProduct) {
    this.id = product.id;
    this.name = product.name;
    this.price = product.price;
    this.images = product.images;
    this.discount = product.discount;
    this.rating = product.rating;
    this.description = product.description;
    this.old_price = product.old_price;
  }
}
