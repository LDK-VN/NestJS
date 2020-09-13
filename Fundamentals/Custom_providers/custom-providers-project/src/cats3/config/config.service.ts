import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    private readonly config = ["config"];
    name: any;

    serviceConfig(): string[] {
        return this.config;
    }    
}
