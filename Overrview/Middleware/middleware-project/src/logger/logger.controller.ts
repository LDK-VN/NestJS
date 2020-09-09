import { Controller, Get } from '@nestjs/common';

@Controller('logger')
export class LoggerController {
    @Get()
    findAll(): string {
        return 'This is logger';
    }
}
