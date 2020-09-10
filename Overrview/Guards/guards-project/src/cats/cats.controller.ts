import { Controller, Get, UseGuards, Post, Body, SetMetadata } from '@nestjs/common';
import { RolesGuard } from 'src/guards/roles.guard';
import { createCatDto } from 'src/dto/create-cat.dto';
import { Roles } from 'src/decorators/roles.decorator';

// @Controller('cats')
// @UseGuards(RolesGuard)
// export class CatsController {
//     @Get()
//     findAll(): string {
//         return 'This is method get';
//     }
// }

@Controller('cats')
export class CatsController {
    @Get()
    findAll(): string {
        return 'This is method get';
    }

    @Post()
    @Roles('admin')
    async create(@Body() createCatDto: createCatDto) {
        return createCatDto;
    }
}

