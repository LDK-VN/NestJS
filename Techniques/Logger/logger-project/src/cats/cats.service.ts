import { Injectable } from '@nestjs/common';
import { MyLogger } from 'src/my_logger';

@Injectable()
export class CatsService {

    constructor(private myLogger: MyLogger) {
    //   this.myLogger.setContext('CatsService');
    }
  
    findAll() {
      this.myLogger.warn('About to return cats!');
      return 'this is return cats';
    }
}
