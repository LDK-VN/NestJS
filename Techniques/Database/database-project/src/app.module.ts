import { CacheInterceptor, CacheModule, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './controllers/users/users.module';
import { PhotosModule } from './controllers/photos/photos.module';
import { Photo } from './db/entities/photo.entity';
import { User } from './db/entities/user.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';

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
  PhotosModule,
  CacheModule.register()
],
  controllers: [AppController],
  providers: [AppService,
    {provide: APP_INTERCEPTOR, useClass: CacheInterceptor}
  ],
})
export class AppModule {}
