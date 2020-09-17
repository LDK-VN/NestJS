import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import config from 'config/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath: ['.development.env', '.env.development.local'],
    isGlobal: true,
    load: [config]
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}