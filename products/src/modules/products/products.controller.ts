import { Controller, Get, Param } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { EventPattern, Payload } from '@nestjs/microservices';
import { IProductsQuery } from '@/modules/products/products.interface';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsRepository: ProductsRepository) {}

  @EventPattern('create-product')
  async create(@Payload() createProductDto: CreateProductDto) {
    return await this.productsRepository.create(createProductDto);
  }

  @EventPattern('update-product')
  async update(@Payload() updateProductDto: Partial<UpdateProductDto>) {
    return await this.productsRepository.update(updateProductDto);
  }

  @EventPattern('all-products')
  async findAll(@Payload() query: IProductsQuery) {
    return await this.productsRepository.getAll(query);
  }

  @EventPattern('one-product')
  async findOne(
    @Payload() productName: string,
    @Param('product') product: string,
  ) {
    await this.productsRepository.findOneByName(product);
    return await this.productsRepository.findOneByName(productName);
  }

  @EventPattern('delete-product')
  async delete(@Payload() id: number) {
    return await this.productsRepository.delete(id);
  }

  @Get(':productId')
  async getOneById(@Param('productId') productId: number) {
    return await this.productsRepository.findOneById(productId);
  }
}
