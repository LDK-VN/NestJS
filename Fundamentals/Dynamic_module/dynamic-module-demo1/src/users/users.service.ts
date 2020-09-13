import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
    private readonly name = ["khanhld","hoangld","tamlh"];

    getName(): string[] {
        return this.name;
    }
}
