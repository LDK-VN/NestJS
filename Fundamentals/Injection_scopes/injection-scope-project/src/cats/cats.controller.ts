import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
    constructor(private catService: CatsService) {
        console.log(catService);
    }

    @Get()
    findAll(): string {
        return 'This is method get';
    }
}
