import { Controller, Get, UseGuards, Post, Body, SetMetadata, UseInterceptors } from '@nestjs/common';
import { LoggingInterceptor } from 'src/interceptors/logging.interceptor';

// @Controller('cats')
// @UseInterceptors(LoggingInterceptor)
// export class CatsController {
//     @Get()
//     findAll(): string {
//         return 'This is method get';
//     }
// }

@Controller('cats')
export class CatsController {
    @Get()
    findAll() {
        setTimeout(() => {
            return;
        },9000)
    }
}




