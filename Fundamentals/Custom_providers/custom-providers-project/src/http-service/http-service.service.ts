import { Injectable, Optional, Inject } from '@nestjs/common';

@Injectable()
export class HttpServiceService<T> {
    constructor(@Optional() @Inject('HTTP_OPTION') private httpCLient: T) {}
}
