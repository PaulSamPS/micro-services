import { IProduct } from '@/modules/products/products.interface';
import { ReceivedFile } from '@/modules/files/files.interface';

export class UpdateProductDto {
  updateProductDto: Omit<IProduct, 'images' | 'id'>;
  files: ReceivedFile[];
  productName: string;
}
