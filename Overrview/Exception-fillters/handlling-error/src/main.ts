import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './exception/http-exception.filter';
import { AllExceptionsFilter } from './exception/all-exceotions-filter-base.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  
  await app.listen(3000);
}
bootstrap();
