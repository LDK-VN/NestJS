import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Photo } from 'src/db/entities/photo.entity';
import { CreatePhotoDto } from 'src/dto/create-photo.dto';
import { Connection, Repository } from 'typeorm';

@Injectable()
export class PhotosService {
    constructor(
        @InjectRepository(Photo)
        private photoRepository: Repository<Photo>,
        private connection: Connection
    ){}

    create(createUserDto: CreatePhotoDto): Promise<Photo> {
        const photo = new Photo();
            
        return this.photoRepository.save(photo);
    }

    findAll(): Promise<Photo[]> {
        return this.photoRepository.find();
    }

    findOne(id: string): Promise<Photo> {
        return this.photoRepository.findOne(id);
    }

    async remove(id: string): Promise<void> {
        await this.photoRepository.delete(id);
    }
}
