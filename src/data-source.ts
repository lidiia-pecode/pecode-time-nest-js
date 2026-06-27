import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

const isProd = process.env.NODE_ENV === 'production';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: +(process.env.DATABASE_PORT ?? 5432),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    isProd ? __dirname + '/**/*.entity.js' : __dirname + '/**/*.entity.ts',
  ],
  synchronize: false,
  migrations: [
    isProd ? __dirname + '/migrations/*.js' : __dirname + '/migrations/*.ts',
  ],
});

export default AppDataSource;
