import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { Cats2Module } from './cats2/cats2.module';
import { Cats3Module } from './cats3/cats3.module';


/**
 * Đăng ký -> Nest IoC container
 */
@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [CatsModule,CatsModule, Cats2Module, Cats3Module]
})
export class AppModule {}
