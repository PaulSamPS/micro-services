export class ReviewsDtoCreate {
  productId: number;
  userId: number;
  firstName: string;
  lastName: string;
  rating: number;
  review: string;
  approved: boolean;
}
