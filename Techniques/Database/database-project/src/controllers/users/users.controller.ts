import { Body, CacheInterceptor, CacheKey, CacheTTL, Controller, Delete, Get, Param, Post, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../db/entities/user.entity';
import { UsersService } from './users.service';
import { PhotosService } from '../photos/photos.service';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly photosService: PhotosService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto): Promise<User> {
        console.log(createUserDto);
        // for(let i = 0; i < createUserDto.photos.length; i++) {
        //     await this.photosService.create(createUserDto.photos[i]);
        // }
        return this.usersService.create(createUserDto);
    }

    @Get()
    findAll(): Promise<User[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    @CacheKey('custom_key')
    @CacheTTL(10)
    findOne(@Param('id') id: string): Promise<User> {
        return this.usersService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.usersService.remove(id);
    }
}
