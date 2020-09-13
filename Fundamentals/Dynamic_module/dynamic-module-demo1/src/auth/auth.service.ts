import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
    private readonly name = [];
    constructor(private usersService: UsersService) {}

    getNames(): string [] {
        return this.usersService.getName();
    }

}
