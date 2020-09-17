import { Body, Controller, Get, Param, ParseArrayPipe, ParseBoolPipe, ParseIntPipe, Post, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { FindOneParams } from './find-one.params';

@Controller('users')
export class UsersController {
    @Post()
    @UsePipes(new ValidationPipe())
    // @UsePipes(new ValidationPipe({ transform: true }))
    async create(@Body() createUserDto: CreateUserDto) {
        console.log(createUserDto instanceof CreateUserDto)
        return 'This action adds a new user';
    }

    // @Get(':id')
    // findOne(@Param() params: FindOneParams) {
    //     return 'This action returns a user';
    // }

    // @Get(':id')
    // findOne(@Param() id: number) {
    //     console.log(typeof id === 'number'); // true
    //     return 'This action returns a user';
    // }

    @Get(':id')
    findOne(
        @Param('id', ParseIntPipe) id: number,
        @Query('sort', ParseBoolPipe) sort: boolean
    ) {
        console.log(typeof id === 'number'); // true
        console.log(typeof sort === 'boolean'); // true
        return 'This action returns a user';
    }

    @Post('bulk')
    createBulk(@Body(new ParseArrayPipe({ items: CreateUserDto })) createUserDtos: CreateUserDto[]) {
        console.log(typeof createUserDtos);
        return 'This acction adds new users';
    }

    @Get()
    findByIds(
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[],
    ) {
        console.log(ids);
        return 'This action returns users by ids';
    }
}
