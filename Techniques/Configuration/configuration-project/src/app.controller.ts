import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private configService: ConfigService) {}

  @Get()
  getHello(): string {
    const dbUser = this.configService.get<string>('database.host');
    console.log(dbUser);
    return this.appService.getHello();
  }
}
