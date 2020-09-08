import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';
import { HttpServiceService } from './http-service/http-service.service';

@Module({
  imports: [CatsService],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService, HttpServiceService],
})
export class AppModule {}
