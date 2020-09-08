import { Controller, Get, ForbiddenException } from '@nestjs/common';

@Controller('catss')
export class CatssController {
    @Get()
    findAll() {
        throw new ForbiddenException;
    }
}
