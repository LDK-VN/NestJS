import { Controller, Get } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CatsService } from './cats.service';

@Controller('cats')
export class CatsController {
    constructor(private catsService: CatsService){}

    @Get()
    findAll(): any {
    return this.catsService.findAll()
    }
}
