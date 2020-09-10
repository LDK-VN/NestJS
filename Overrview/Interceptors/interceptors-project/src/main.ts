import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './interceptors/logging.interceptor';
import { TransformInterceptor } from './interceptors/transform.interceptor';
import { ExecludeNullInterceptor } from './interceptors/execlude-null.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { TimeoutInterceptor } from './interceptors/timeout.interceptor';
import { logger } from './cats/middleware/logger.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new TimeoutInterceptor());
  app.use(logger);
  await app.listen(3000);
}
bootstrap();
