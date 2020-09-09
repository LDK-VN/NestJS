import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerController } from './logger/logger.controller';
import { logger } from './logger.middleware';
import { CatsController } from './cats/cats.controller';
import { CatsModule } from './cats/cats.module';
import { cors } from './cors.middleware';

@Module({
  imports: [CatsModule],
  controllers: [AppController, LoggerController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware)
  //     .forRoutes({path: 'cats', method: RequestMethod.GET});
  // }

  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggerMiddleware)
  //     .forRoutes(CatsController);
  // }

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cors,logger)
      .exclude(
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
        'cats/(.*)',)
      .forRoutes(CatsController)
  }
}
