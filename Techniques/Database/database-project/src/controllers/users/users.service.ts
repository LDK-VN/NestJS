import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../db/entities/user.entity';
import { PhotosService } from '../photos/photos.service';
import { Photo } from 'src/db/entities/photo.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private connection: Connection,
    ){}

    async create(createUserDto: CreateUserDto): Promise<User> {
        const user = new User();
        user.firstName = createUserDto.firstName;
        user.lastName = createUserDto.lastName;
        user.photos = createUserDto.photos;

        // for(let i = 0; i < createUserDto.photos.length; i++) {
        //     await this.photosService.create(createUserDto.photos[i]);
        // }

        user.photos = createUserDto.photos;

        return await this.usersRepository.save(user);
    }

    findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }

    findOne(id: string): Promise<any> {
        return this.usersRepository.findOne(id, {relations:["photos"]});
    }

    async remove(id: string): Promise<void> {
        await this.usersRepository.delete(id);
    }

    // Sử dụng QueryRunner
    async createMany(users: User[]) {
        const queryRunner = this.connection.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await queryRunner.manager.save(users[0]);
            await queryRunner.manager.save(users[1]);

            await queryRunner.commitTransaction();
        } catch(err) {
            // Khôi phục khi có lỗi
            await queryRunner.rollbackTransaction();
        } finally {
            // phát hành queryRunner tạo thủ công
            await queryRunner.release();
        }
    }

    // Sử dụng transaction
    async createMany2(users: User[]) {
        await this.connection.transaction(async manager => {
            await manager.save(users[0]);
            await manager.save([users[1]]);
        })
    }

}
