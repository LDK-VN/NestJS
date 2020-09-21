import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioService } from './audio/audio.service';

@Module({
  imports: [BullModule.registerQueue({
    name: 'audio',
    redis: {
      host: 'localhost',
      port: 6379
    }
  })],
  controllers: [AppController],
  providers: [AppService, AudioService],
})
export class AppModule {}
