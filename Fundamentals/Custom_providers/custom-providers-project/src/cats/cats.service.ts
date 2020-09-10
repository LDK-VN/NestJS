import { Injectable } from '@nestjs/common';
import { Cat } from 'src/interfaces/cat.interface';

@Injectable()
export class CatsService {
    private readonly cats: Cat[] = [];

    findAll(): Cat[] {
        return this.cats;
    }
}
