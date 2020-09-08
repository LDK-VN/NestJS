import { Controller, Get, Res } from '@nestjs/common';

@Controller('cats')
export class CatsController {
    @Get()
    findAll(@Res() response): string {
        response.status(201).send();
        return ' This action returns all cats';
    }
}
