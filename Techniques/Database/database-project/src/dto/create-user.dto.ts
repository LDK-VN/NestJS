import { Photo } from "src/db/entities/photo.entity";

export class CreateUserDto {
    firstName: string;
    lastName: string;
    photos: Photo[]
}