import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Inject,
  Param,
  Patch,
  Post,
  Query,
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
import { lastValueFrom } from 'rxjs';
import { UpdateProductDto } from './dto/update-product.dto';
import { IProductsQuery } from './products.interface';

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
    try {
      return await lastValueFrom(
        this.client.send('create-product', { createProductDto, files }),
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('images'))
  @Patch(':productName')
  async update(
    @Param('productName') productName: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    try {
      return await lastValueFrom(
        this.client.send('update-product', {
          productName,
          updateProductDto,
          files,
        }),
      );
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @Get()
  async getAll(@Query() query: IProductsQuery) {
    return await lastValueFrom(this.client.send('all-products', query));
  }

  @Get(':productName')
  async getOne(@Param('productName') productName: string) {
    try {
      return await lastValueFrom(this.client.send('one-product', productName));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return await lastValueFrom(this.client.send('delete-product', id));
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
