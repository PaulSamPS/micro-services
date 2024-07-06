import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { JwtAuthGuard } from '@/guards/jwt.guard';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdminGuard } from '@/guards/admin.guard';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('product')
export class ProductsController {
  constructor(private readonly productsRepository: ProductsRepository) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.productsRepository.create(createProductDto, files);
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
  @Patch(':id')
  update(
    @Param('name') name: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return 'id';
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
