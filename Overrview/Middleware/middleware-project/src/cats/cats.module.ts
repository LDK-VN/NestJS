import { Module, MiddlewareConsumer } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { logger } from 'src/logger.middleware';

@Module({
  controllers: [CatsController],
  providers: [CatsService]
})
export class CatsModule {
 
}
