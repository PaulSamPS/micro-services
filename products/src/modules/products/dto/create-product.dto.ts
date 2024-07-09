import { IProduct } from '../products.interface';
import { ReceivedFile } from '@/modules/files/files.interface';

export class CreateProductDto {
  createProductDto: Omit<IProduct, 'images' | 'id'>;
  files: ReceivedFile[];
}
