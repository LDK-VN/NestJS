import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';
import { MulterConfigService } from './multer-optons/multer-configs.service';

@Module({
  imports: [MulterModule.registerAsync({
    useClass: MulterConfigService
  })],
  controllers: [AppController, CatsController],
  providers: [AppService, MulterConfigService],
})
export class AppModule {}
