import { Controller, Get, Post, Header, Redirect, Param, Req, Query, Put } from '@nestjs/common';
import { Request } from 'express';
@Controller('cats')
export class CatsController {
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

    @Put()
    findOneTwo(): string {
        return `This is method put`;
    }
}
