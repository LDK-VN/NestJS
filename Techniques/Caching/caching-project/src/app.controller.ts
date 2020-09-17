import { CacheInterceptor, Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  public number = []
  constructor(private readonly appService: AppService) {
    
  }

  @Get()
  findAll() : string[]{  

    return [

    ];
  }
}