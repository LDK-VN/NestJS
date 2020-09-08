import { Controller, Body, Post, Get, Query, Param, Put } from '@nestjs/common';
import { CreateCatDto } from 'src/dto/create-cat.dto';

@Controller('catsss')
export class CatsFullResourceSampleController {
    @Post()
    create(@Body() CreateCatDto: CreateCatDto) {
        return 'This actionn add a new cat';
    } 

    @Get(':id')
    findOne(@Param('id') id: string) {
        return `This action returns a #{id} cat`;
    }
    
}

