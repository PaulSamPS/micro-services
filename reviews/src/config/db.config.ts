import { registerAs } from '@nestjs/config';

/**
 * Конфигурация базы данных.
 * Загружает параметры подключения к базе данных из переменных окружения.
 * По умолчанию используется PostgreSQL, логгирование включено, хост - localhost,
 * порт - 5433, имя пользователя - commerce, пароль - commerce, название базы данных - commerce.
 * Автоматическая загрузка сущностей и синхронизация схемы базы данных включены.
 */
export const dbConfig = registerAs('database', () => ({
  dialect: process.env.SQL_DIALECT || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: +process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  autoLoadEntities: true,
  synchronize: true,
}));
