import { HttpModuleOptionsFactory, Injectable } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class HttpConfigService implements HttpModuleOptionsFactory {
    createHttpOptions(): AxiosRequestConfig | Promise<AxiosRequestConfig> {
        return {
            timeout: 5000,
            maxRedirects: 5,
        }
    }

}
