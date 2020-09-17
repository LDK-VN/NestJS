import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './controllers/users/users.module';
import { PhotosController } from './controllers/photos/photos.controller';
import { PhotosModule } from './controllers/photos/photos.module';
import { Photo } from './db/entities/photo.entity';
import { User } from './db/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forRoot({
    type:'mysql',
    host:'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'test',
    entities: [Photo,User],
    autoLoadEntities: true,
    synchronize: true,
  }),
  UsersModule,
  PhotosModule
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
