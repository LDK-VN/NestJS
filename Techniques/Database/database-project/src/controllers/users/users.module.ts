import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UserSubscriber } from '../../db/subscriber/user.subscriber';
import { UserSchema } from '../../db/schema/user.schema';
import { PhotosModule } from '../photos/photos.module';
import { User } from 'src/db/entities/user.entity';

@Module({
    imports:[TypeOrmModule.forFeature([User]), PhotosModule],
    providers:[UsersService, UserSubscriber],
    controllers: [UsersController]
})
export class UsersModule {}
