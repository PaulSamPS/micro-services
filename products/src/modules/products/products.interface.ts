export interface IImg {
  url: string;
  name: string;
}

export interface IProduct {
  id?: number;
  name: string;
  price: number;
  old_price: number;
  images: IImg[];
  discount: number;
  description: string;
  rating: number;
}

export interface IProductsQuery {
  limit: string;
  offset: string;
}
