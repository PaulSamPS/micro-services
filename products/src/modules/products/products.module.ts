import { Module } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { ProductsController } from './products.controller';
import { JwtService } from '@nestjs/jwt';
import { ProductsModel } from '@/products/products.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { FilesService } from '@/files';

@Module({
  imports: [SequelizeModule.forFeature([ProductsModel])],
  providers: [ProductsRepository, JwtService, FilesService],
  controllers: [ProductsController],
})
export class ProductsModule {}
