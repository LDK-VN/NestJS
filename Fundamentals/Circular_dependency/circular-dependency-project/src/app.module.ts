import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsService } from './cats/cats.service';
import { CommonService } from './common/common.service';
import { CommonModule } from './common/common.module';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CommonModule, CatsModule],
  controllers: [AppController],
  providers: [AppService, CatsService, CommonService],
})
export class AppModule {}
