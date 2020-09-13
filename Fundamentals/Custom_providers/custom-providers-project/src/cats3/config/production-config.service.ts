import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductionConfigService {
    private readonly name = ["khanhpro"]

    proName(): string[] {
        return this.name;
    }
}
