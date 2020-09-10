import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ExecludeNullInterceptor } from './interceptors/execlude-null.interceptor';
import { logger } from './cats/middleware/logger.middleware';
import { CatsController } from './cats/cats.controller';

@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_INTERCEPTOR,
    useClass:ExecludeNullInterceptor,
  }],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(logger)
      .exclude(
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
        'cats/(.*)',)
      .forRoutes(CatsController)
  }
}
