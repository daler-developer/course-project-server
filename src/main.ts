import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CatchAllExceptionFilter } from './core/exception-filter';
import * as cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: 'dcupjdnqe',
  api_key: '765477428821251',
  api_secret: 'sFtUfwjC8wKEese5kx1qHYSQz7g',
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new CatchAllExceptionFilter());

  await app.listen(process.env.PORT || 4000);
}
bootstrap();
