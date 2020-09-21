import { HttpService, Injectable } from '@nestjs/common';
import { AxiosResponse} from 'axios';
import { Observable } from 'rxjs';

class Cat {
    name: string;
    age: number
}

@Injectable()
export class CatsService {
    constructor(private httpService: HttpService) {}

    findAll(): Observable<AxiosResponse<Cat[]>> {
        return this.httpService.get('http://localhost:3000/cats');
    }
}
