import { User } from "src/db/entities/user.entity";

export class CreatePhotoDto {
    name: string;
    description: string;
    fileName: string;
    views: number;
    isPublished: boolean;
    userId: string;
    user: User
}