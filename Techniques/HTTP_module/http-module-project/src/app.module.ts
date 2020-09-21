import { HttpModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';
import { CatsController } from './cats/cats.controller';
import { HttpConfigService } from './http-config/http-config.service';

@Module({
  imports: [HttpModule.register({
    timeout: 6000,
    maxRedirects: 1
  })],
  controllers: [AppController, CatsController],
  providers: [AppService, CatsService, HttpConfigService],
})
export class AppModule {}
