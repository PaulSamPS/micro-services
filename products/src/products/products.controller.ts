import { Controller, Get, Param, Delete, UseGuards } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdminGuard } from '@/guards/admin.guard';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class ProductsController {
  constructor(private readonly productsRepository: ProductsRepository) {}

  @EventPattern('create-product')
  async create(createProductDto: CreateProductDto) {
    return await this.productsRepository.create(createProductDto);
  }

  @EventPattern('update-product')
  async update(updateProductDto: Partial<UpdateProductDto>) {
    return await this.productsRepository.update(updateProductDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return 'findAll';
  }

  @Get(':name')
  findOne(@Param('name') name: string) {
    return this.productsRepository.findOneByName(name);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return 'id';
  }

  // @UseGuards(JwtAuthGuard)
  // @UseGuards(AdminGuard)
  // @Post()
  // changeRating(@Body() { product_id: number, rating: number }) {}
}
