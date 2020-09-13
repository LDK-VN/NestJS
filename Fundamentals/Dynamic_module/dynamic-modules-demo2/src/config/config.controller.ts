import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './config.service';

@Controller('config')
export class ConfigController {
    constructor(private config: ConfigService) {}

    @Get()
    findAll() {
        return this.config.get('HELLO_MESSAGE');
    }
}
