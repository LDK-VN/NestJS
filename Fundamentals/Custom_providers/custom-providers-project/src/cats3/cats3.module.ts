import { Module } from '@nestjs/common';
import { Cats3Controller } from './cats3.controller';
import { ConfigService } from './config/config.service';
import { DevelopmentConfigService } from './config/development-config.service';
import { ProductionConfigService } from './config/production-config.service';

const configServiceProvider = {
  provide: ConfigService,
  useClass: 1 === 1 ? DevelopmentConfigService : ProductionConfigService
}

@Module({
  controllers: [Cats3Controller],
  providers: [configServiceProvider]
})
export class Cats3Module {}
