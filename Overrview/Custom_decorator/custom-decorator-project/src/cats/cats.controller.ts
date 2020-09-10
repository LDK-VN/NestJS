import { Controller, Get, ValidationPipe } from '@nestjs/common';
import { User } from 'src/decorator/user.decorator';

@Controller('cats')
export class CatsController {
    // @Get()
    // async findOne(@User('firstName')firstName: string) {
    //     console.log(firstName);
    // }

    // @Get()
    // async findOne(@User(new ValidationPipe)) user : UserEntity) {
    //     console.log(user);
    // }
}
