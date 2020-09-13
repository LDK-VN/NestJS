import { Injectable } from '@nestjs/common';

@Injectable()
export class DevelopmentConfigService {
    private readonly name = ["khanhdev"]

    devName(): string[] {
        return this.name;
    }
}
