import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'ankit',
  database: 'ecommerce',
  autoLoadEntities: true,
  synchronize: true, // ⚠️ only for dev
};