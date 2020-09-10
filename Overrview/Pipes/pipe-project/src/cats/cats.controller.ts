import { Controller, Get, Param, ParseUUIDPipe, Post, Body, Query, DefaultValuePipe, ParseBoolPipe } from '@nestjs/common';
import { Request } from 'express';
import { CreateCatDto } from 'src/dto/cats.dto';
import { CatsService } from './cats.service';
import { Cat } from 'src/interfaces/cats.interface';
import { ValidationPipe } from 'src/pipe/validation.pipe';
import { ParseIntPipe } from 'src/pipe/parse-int.pipe';
import { boolean, number } from '@hapi/joi';


@Controller('cats')
export class CatsController {

    // @Get(':id')
    // async findOne(@Param('id', ParseIntPipe) id: number) {
    //     return `This actionn returns a #${id} cat`;
    // }

    // @Get(':id')
    // async findOne(@Param('id', new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number) {
    //     return `This actionn returns a #${id} cat`;
    // }

    // @Get(':uuid')
    // async findOne(@Param('uuid', new ParseUUIDPipe) uuid: string) {
    //     return `This actionn returns a #${uuid} cat`;
    // }

    // @Post()
    // async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
    //     return 'this is method post';
    // }

    constructor(private catService: CatsService) { }

    @Post()
    async create(@Body() createDto: CreateCatDto) {
        this.catService.create(createDto);
    }

    // @Get()
    // async findAll(): Promise<Cat[]> {
    //     return this.catService.findAll();
    // }

    @Get()
    async findAll(
        @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    ) {
        console.log('activeOnly: ' + activeOnly);
        console.log('page', page);
        return this.catService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id', new ParseIntPipe()) id) {
        return `This is id ${id}`;
    }
}
