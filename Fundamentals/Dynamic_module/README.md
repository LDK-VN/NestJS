# Dynamic module

## Wnat is dunamic module

Dynamic module cung cấp một API -> import module này vào module khác, tuỳ chỉnh thuộc tính, hành vi module khi import

## Config module example

**ConfigModule** nhận **options** -> có thể cấu hình ->  quản lý **.env** file -> bất kỳ folder nào bạn chọn

```ts
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';

@Module({
  imports: [ConfigModule.register({ folder: './config' })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

1. **ConfigModule** là 1 class -> có static method **register()** -> quy ước -> **register()** hoặc **forRoot()**.
2. **register()** -> dev định nghĩa -> nhận arguments -> trường hợp này nhận **options** object
3. **register()** trả về -> **module** -> vì nằm trong **imports**

Thực tế trả về -> **DynamicModule** => module API -> return **module**

```ts
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({})
export class ConfigModule {
  static register(): DynamicModule {
    return {
      module: ConfigModule,
      providers: [ConfigService],
      exports: [ConfigService],
    };
  }
}
```

## Module configuration

```ts
import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { EnvConfig } from './interfaces';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor() {
    const options = { folder: './config' };

    const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    const envFile = path.resolve(__dirname, '../../', options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
```

Sử dugnj DI -> đưa **options** obj từ **register()** -> **ConfigService**

```ts
import { DynamicModule, Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({})
export class ConfigModule {
  static register(options): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'CONFIG_OPTIONS',
          useValue: options,
        },
        ConfigService,
      ],
      exports: [ConfigService],
    };
  }
}
```

Đưa 'CONFIG_OPTION' -> vào **ConfigService** provider

```ts
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable, Inject } from '@nestjs/common';
import { EnvConfig } from './interfaces';

@Injectable()
export class ConfigService {
  private readonly envConfig: EnvConfig;

  constructor(@Inject('CONFIG_OPTIONS') private options) {
    const filePath = `${process.env.NODE_ENV || 'development'}.env`;
    const envFile = path.resolve(__dirname, '../../', options.folder, filePath);
    this.envConfig = dotenv.parse(fs.readFileSync(envFile));
  }

  get(key: string): string {
    return this.envConfig[key];
  }
}
```

Đơn giản hơn -> 'CONFIG_OPTIONS' -> là hằng số trong 1 files riêng biệt

```ts
export const CONFIG_OPTIONS = 'CONFIG_OPTIONS';
```