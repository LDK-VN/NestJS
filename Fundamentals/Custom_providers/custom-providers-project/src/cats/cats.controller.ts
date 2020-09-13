import { Controller, Post, Body, Get } from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from 'src/dto/create-cat.dto';
import { Cat } from 'src/interfaces/cat.interface';

@Controller('cats')
export class CatsController {
    
    /**
     * Injection provider
     */
    constructor(private catService: CatsService) {}

    @Post()
    async create(@Body() createDto: CreateCatDto) {
        this.catService.create(createDto);
    }

    @Get()
    async findAll(): Promise<Cat[]> {
        console.log(this.catService);
        return this.catService.findAll();
    }
}
