import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { CatssController } from './catss/catss.controller';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './exception/http-exception.filter';

@Module({
  imports: [],
  controllers: [AppController, CatsController, CatssController],
  providers: [AppService,{
    provide: APP_FILTER,
    useClass: HttpExceptionFilter
  }],
})
export class AppModule {}
