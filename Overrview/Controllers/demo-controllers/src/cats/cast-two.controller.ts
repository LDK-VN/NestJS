import { Controller, Get, HostParam } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Controller({host: ':localhost'})
export class CastTwoController {
    @Get("cats-two")
    index(): string {
        return 'Admin page';
    }

    @Get("host-param")
    getInfo(@HostParam('localhost') localhost: string) {
        return localhost;
    }

    @Get()
    findAll(): Observable<any[]> {
        return of([]);
    }
}
