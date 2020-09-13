import { Controller, Get, Inject } from '@nestjs/common';
import { connection } from './connection';
import { Connection } from './connectionclass';

@Controller('cats2')
export class Cats2Controller {

    /**
     * Non-class-based provider tokens
     */

     constructor (@Inject('CONNECTION') connection: Connection) {}

    @Get()
    findAll(): string {
        console.log(connection)
        return 'Opps!';
    }
}
