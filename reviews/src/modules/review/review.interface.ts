export interface IQuery {
  limit: string;
  offset: string;
}

export interface IReview {
  userId: number;
  productId: number;
  firstName: string;
  lastName: string;
  rating: number;
  text: string;
  approved: boolean;
}
