import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Photo } from 'src/db/entities/photo.entity';
import { PhotoSchema } from 'src/db/schema/photo.schema';
import { PhotoSubscriber } from 'src/db/subscriber/photo.subscriber';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';

@Module({
  imports:[TypeOrmModule.forFeature([Photo])],
  providers:[PhotosService, PhotoSubscriber],
  controllers: [PhotosController],
  exports: [PhotosService]
})
export class PhotosModule {}
