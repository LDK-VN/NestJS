import { EntitySchema } from 'typeorm';
import { Photo } from '../entities/photo.entity';

export const PhotoSchema = new EntitySchema<Photo>({
    name: 'Photo',
    target: Photo,
    columns: {
        id: {
            type: Number,
            primary: true,
            generated: true,
        },
        name: {
            type: String
        },
        description: {
            type: String
        },
        fileName: {
            type: String
        },
        views: {
            type: Number
        },
        isPublished: {
            type: Boolean,
            default: true
        }

    },
    relations: {
        user: {
            type: 'many-to-one',
            target: 'User', // the name of the PhotoSchema
        },
    },
});