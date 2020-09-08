import { Controller, Get, HttpException, HttpStatus, ForbiddenException, Post, UseFilters, Body } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';
import { CreateCatDto } from 'src/dto/create-cat.dto';

@Controller('cats')
export class CatsController {
    @Get()
    async findAll() {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    @Get('override-content')
    async findAllTwo() {
        throw new HttpException({
            status: HttpStatus.FORBIDDEN,
            error: 'This is a custom message',
        }, HttpStatus.FORBIDDEN);
    }

    @Get('custom-exception')
    async findAllThree() {
        throw new ForbiddenException();
    }

    @Post('binding-filter-1')
    @UseFilters(new HttpExceptionFilter())
    async create(@Body() createCatDto: CreateCatDto) {
        throw new ForbiddenException;
    }

    @Post('binding-filter-2')
    @UseFilters(HttpExceptionFilter)
    async createTwo(@Body() createCatDto: CreateCatDto) {
        throw new ForbiddenException();
    }
}
