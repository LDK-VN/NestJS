import { Controller, Get } from '@nestjs/common';
import { ConfigService } from './config/config.service';

@Controller('cats3')
export class Cats3Controller {
    
    constructor(private configService: ConfigService) {}

    @Get ()
    findAll(): string {
        console.log(this.configService.serviceConfig)
        console.log(this.configService?.name[0])
        return this.configService?.name[0];
    }
}
