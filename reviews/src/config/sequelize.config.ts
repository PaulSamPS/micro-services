import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Dialect } from 'sequelize';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';

/**
 * Интерфейс для описания конфигурации базы данных.
 */
interface DatabaseConfig {
  dialect: Dialect;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  autoLoadEntities: boolean;
  synchronize: boolean;
}

/**
 * Сервис для настройки параметров Sequelize.
 * Реализует интерфейс SequelizeOptionsFactory.
 */
@Injectable()
export class SequelizeConfig implements SequelizeOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Метод для создания опций конфигурации Sequelize.
   * @returns Опции конфигурации Sequelize.
   */
  createSequelizeOptions(): SequelizeModuleOptions {
    // Получаем конфигурацию базы данных из конфигурационного сервиса
    const databaseConfig = this.configService.get<DatabaseConfig>('database');

    // Возвращаем опции конфигурации Sequelize, основанные на конфигурации базы данных
    return {
      ...databaseConfig,
      autoLoadModels: true,
      define: {
        charset: 'utf8',
        collate: 'utf8_general_ci',
      },
    };
  }
}
