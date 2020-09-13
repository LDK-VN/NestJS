import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import { CONFIG_OPTIONS } from './constants';
import { ConfigController } from './config.controller';

export interface ConfigModuleOptions {
  folder: string;
}

@Module({
  controllers: [ConfigController]
})
export class ConfigModule {
  static register(options: ConfigModuleOptions): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: CONFIG_OPTIONS,
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
