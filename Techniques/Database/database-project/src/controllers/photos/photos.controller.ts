import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { Photo } from 'src/db/entities/photo.entity';
import { CreatePhotoDto } from 'src/dto/create-photo.dto';
import { PhotosService } from './photos.service';

@Controller('photos')
export class PhotosController {
    constructor(private readonly photosService: PhotosService) { }

    @Post()
    create(@Body() createPhotoDto: CreatePhotoDto): Promise<Photo> {
        return this.photosService.create(createPhotoDto);
    }

    @Get()
    findAll(): Promise<Photo[]> {
        return this.photosService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string): Promise<Photo> {
        return this.photosService.findOne(id);
    }

    @Delete(':id')
    remove(@Param('id') id: string): Promise<void> {
        return this.photosService.remove(id);
    }
}
