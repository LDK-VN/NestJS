import { Controller, Get, Req, Post, HttpCode, Header, Redirect, Query, Param, Body } from '@nestjs/common';
import { Request } from 'express';
import { CreateCatDto } from 'src/dto/create-cat.dto';

@Controller('cats')
export class CatsController {

    @Post()
    @HttpCode(204)
    create(@Body() createCatDto: CreateCatDto): string {
        console.log(createCatDto)
        return 'This action adds a new cat';
    }

    @Post('2')
    @Header('Cache-Control', 'none')
    createTwo(): string {
        return 'This action 2 adds a new cat';
    }

    @Get('ab*cd')
    findTwoAll(): string {
        return 'This route uses a wildcard';
    }

    @Get()
    findAll(@Req() request: Request): string {
        return ' This action returns all cats';
    }

    @Get('docs')
    @Redirect('https://docs.nestjs.com', 302)
    getDocs(@Query('version') version) {
        if (version && version === '5') {
            return { url: 'https://docs.nestjs.com/v5/' };
        }
    }

    @Get(':id')
    findOne(@Param() params): string {
        console.log(params.id);
        return `This actionn returns a #${params.id} cat`;
    }

    @Get(':id')
    findOneTwo(@Param('id') id): string {
        return `This action returns a #${id} cat`;
    }

}
