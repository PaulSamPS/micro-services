import {
  Body,
  Controller,
  Inject,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PRODUCTS_SERVICE } from './constants';
import { AdminGuard } from '../../guards/admin.guard';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
  constructor(@Inject(PRODUCTS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.client.send('create-product', { createProductDto, files });
  }
}
