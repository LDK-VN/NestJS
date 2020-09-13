/**
 * @Injectable() decorator class -> provider
 */
import { Injectable } from "@nestjs/common";
import { Cat } from "../interfaces/cat.interface";

@Injectable()
export class CatsService {
    /**
     * readonly: chỉ được khởi tạo một lần duy nhất
     */
    private readonly cats: Cat[] = [];

    create(cat: Cat) {
        this.cats.push(cat);
    }

    findAll(): Cat[] {
        return this.cats;
    }
}