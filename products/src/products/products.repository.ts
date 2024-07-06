import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductsModel } from '@/products/products.model';
import { CreateProductDto } from '@/products/dto/create-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateProductDto } from '@/products/dto/update-product.dto';
import { FilesService } from '@/files';
import { calculateDiscount } from '@/lib/calculate-discount';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(ProductsModel)
    private readonly productsModel: typeof ProductsModel,
    private readonly fileService: FilesService,
  ) {}

  private async processProductImages(
    productDto: CreateProductDto | UpdateProductDto,
    files: Express.Multer.File[],
  ) {
    return this.fileService.processAndSaveImages(
      files,
      productDto.name,
      'products',
    );
  }

  async findOneByName(name: string): Promise<ProductsModel> {
    return await this.productsModel.findOne({ where: { name } });
  }
  async findOneById(product_id: number): Promise<ProductsModel> {
    return await this.productsModel.findByPk(product_id);
  }

  async create(
    createProductDto: CreateProductDto,
    files: Express.Multer.File[],
  ) {
    try {
      const existingProduct = await this.findOneByName(createProductDto.name);

      if (existingProduct) {
        return {
          message: 'Товар с таким именем уже существует',
          status: HttpStatus.CONFLICT,
        };
      }

      const images = await this.processProductImages(createProductDto, files);

      const product = new ProductsModel({
        ...createProductDto,
        images,
        rating: 0,
        discount: calculateDiscount(
          createProductDto.old_price,
          createProductDto.price,
        ),
      });

      return await product.save();
    } catch (error) {
      console.error('Ошибка при создании продукта:', error);

      throw new HttpException(
        'Ошибка при создании продукта. Пожалуйста, попробуйте еще раз.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(name: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOneByName(name);

    if (!product) {
      throw new HttpException('Продукт не найден', HttpStatus.BAD_REQUEST);
    }
  }

  async changeRating(product_id: number, rating: number) {
    const product = await this.findOneById(product_id);

    if (!product) {
      throw new HttpException('Продукт не найден', HttpStatus.BAD_REQUEST);
    }

    product.rating = rating;

    return await product.save();
  }
}
