import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { CastTwoController } from './cats/cast-two.controller';
import { CatsFullResourceSampleController } from './cats/cats-full-resource-sample.controller';
import { CastControllerLibController } from './cats/cast-controller-lib.controller';

@Module({
  imports: [],
  controllers: [AppController, CatsController, CastTwoController, CatsFullResourceSampleController, CastControllerLibController],
  providers: [AppService],
})
export class AppModule {}
