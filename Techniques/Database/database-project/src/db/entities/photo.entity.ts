import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;
    
    @Column()
    fileName: string;

    @Column()
    views: number;

    @Column()
    isPublished: boolean;

    @ManyToOne(type => User, user => user.photos)
    user: User;
}