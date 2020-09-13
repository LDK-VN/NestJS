import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {

    private name = [];
    constructor(private auth: AuthService){}

    @Get()
    findName(): string[] {
        this.auth.getNames().forEach((value) => {
            this.name.push(value);
        })
        return this.name;
    }
}
