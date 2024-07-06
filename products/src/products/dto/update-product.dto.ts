import { IProduct } from '@/products/products.interface';
import { ReceivedFile } from '@/files/files.interface';

export class UpdateProductDto {
  updateProductDto: Omit<IProduct, 'images' | 'id'>;
  files: ReceivedFile[];
  productName: string;
}
