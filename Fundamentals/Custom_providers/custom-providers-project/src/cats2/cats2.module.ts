import { Module } from '@nestjs/common';
import { Cats2Controller } from './cats2.controller';
import { connection } from './connection';

@Module({
    providers: [
        {
            provide: 'CONNECTION',
            useValue: connection
        }
    ],
    controllers: [Cats2Controller]
})
export class Cats2Module {}
