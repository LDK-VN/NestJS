import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
    private readonly users: User[];

    constructor() {
        this.users = [
            {
                userId: 1,
                username: 'khanhld',
                password: 'khanhleduy'
            },
            {
                userId: 2,
                username: 'tamlh',
                password: '123456'
            },
            {
                userId: 3,
                username: 'hoangld',
                password: '111111',
            }
        ]
    }
    async findOne(username: string) : Promise<User | undefined> {
        return this.users.find(user => user.username === username);
    } 
}
