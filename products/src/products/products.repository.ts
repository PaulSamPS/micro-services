import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductsModel } from '@/products/products.model';
import { CreateProductDto } from '@/products/dto/create-product.dto';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateProductDto } from '@/products/dto/update-product.dto';
import { FilesService } from '@/files';
import { calculateDiscount } from '@/lib/calculate-discount';
import { ReceivedFile } from '@/files/files.interface';
import { RpcException } from '@nestjs/microservices';
import { IProductsQuery } from '@/products/products.interface';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(ProductsModel)
    private readonly productsModel: typeof ProductsModel,
    private readonly fileService: FilesService,
  ) {}

  private async processProductImages(
    productName: string,
    files: ReceivedFile[],
  ) {
    return this.fileService.processAndSaveImages(
      files,
      productName,
      'products',
    );
  }

  async findOneByName(name: string): Promise<ProductsModel> {
    return await this.productsModel.findOne({ where: { name } });
  }
  async findOneById(product_id: number): Promise<ProductsModel> {
    return await this.productsModel.findByPk(product_id);
  }

  async create({ createProductDto, files }: CreateProductDto) {
    try {
      const existingProduct = await this.findOneByName(createProductDto.name);

      if (existingProduct) {
        return {
          message: 'Товар с таким именем уже существует',
          status: HttpStatus.CONFLICT,
        };
      }
      const images = await this.processProductImages(
        createProductDto.name,
        files,
      );

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
      throw new RpcException(
        'Ошибка при создании продукта. Пожалуйста, попробуйте еще раз.',
      );
    }
  }

  async update({
    productName,
    updateProductDto,
    files,
  }: Partial<UpdateProductDto>) {
    const product = await this.findOneByName(productName);

    if (!product) {
      throw new RpcException('Продукт не найден');
    }

    if (files.length > 0) {
      product.images = await this.processProductImages(product.name, files);
    }

    Object.assign(product, updateProductDto);

    return product.save();
  }

  async changeRating(product_id: number, rating: number) {
    const product = await this.findOneById(product_id);

    if (!product) {
      throw new HttpException('Продукт не найден', HttpStatus.BAD_REQUEST);
    }

    product.rating = rating;

    return await product.save();
  }

  async getAll(query: IProductsQuery) {
    const limit = +query.limit || 10;
    const offset = +query.offset || 0;

    const products = await this.productsModel.findAndCountAll({
      limit,
      offset,
      order: [['id', 'ASC']],
    });

    return { count: products.rows.length, products: products.rows };
  }
}
