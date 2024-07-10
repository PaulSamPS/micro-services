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
import { ErrorInterceptor } from '../../interceptors/error-interceptor';

@Controller('products')
export class ProductsController {
  constructor(@Inject(PRODUCTS_SERVICE) private readonly client: ClientProxy) {}

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('images'), ErrorInterceptor)
  @Post()
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await lastValueFrom(
      this.client.send('create-product', { createProductDto, files }),
    );
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @UseInterceptors(FilesInterceptor('images'), ErrorInterceptor)
  @Patch(':productName')
  async update(
    @Param('productName') productName: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return await lastValueFrom(
      this.client.send('update-product', {
        productName,
        updateProductDto,
        files,
      }),
    );
  }

  @Get()
  @UseInterceptors(ErrorInterceptor)
  async getAll(@Query() query: IProductsQuery) {
    return await lastValueFrom(this.client.send('all-products', query));
  }

  @Get(':productName')
  @UseInterceptors(ErrorInterceptor)
  async getOne(@Param('productName') productName: string) {
    return await lastValueFrom(this.client.send('one-product', productName));
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(AdminGuard)
  @Delete(':id')
  @UseInterceptors(ErrorInterceptor)
  async remove(@Param('id') id: string) {
    return await lastValueFrom(this.client.send('delete-product', id));
  }
}
