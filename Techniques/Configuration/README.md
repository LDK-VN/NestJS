# Configuration (Cấu hình)

Các ứng dụng thường chạy trên cac môi trường khác nhau . Tuỳ vào môi trường, cài đặt cấu hình cũng sẽ khác nhau. Vì các biến cấu hình thay đổi nên các tốt nhất là lưu biến config trong enviroment.

## Installationn (Cài đặt)

```bash
$ npm i --save @nestjs/config
```

## Getting started (Bắt đầu)

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```

imports **ConfigModule.forRoot()**

```ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
})
export class AppModule {}
```

Tạo tệp **.env**

```ts
DATABASE_USER=test
DATABASE_PASSWORD=test
```

## Custom env file path (tuỳ chỉnh đường dẫn)

```ts
ConfigModule.forRoot({
  envFilePath: '.development.env',
});
```

Thêm nhiều path

```ts
ConfigModule.forRoot({
  envFilePath: ['.env.development.local', '.env.development'],
});
```

Ưu tiên biến đầu tìm thấy


## Disable env variables loading (Tắt các biên env đang tải)

Sử dụng **ignoreEnvFile** = true

```ts
ConfigModule.forRoot({
  ignoreEnvFile: true,
});
```

## Use module globally (Sử dụng module toàn cầu)

Đặt **isGlobal=true** trong root module

```ts
ConfigModule.forRoot({
  isGlobal: true,
});
```

## Custom configuration files (Tệp cấu hình tuỳ chỉnh)

Cho phép lồng các đối tượng cấu hình liên quan theo chức năng

```ts
// config/config.ts

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT, 10) || 5432
  }
});
```

Load file này -> **load** trong **ConfigModule.forRoot()**

```ts
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
  ],
})
export class AppModule {}
```

## Using the ConfigService

Truy cập giá trị config -> inject **ConfigService**

```ts
// feature.module.ts

@Module({
    imports: [ConfigModule],
    //...
})
```

Đưa vào constructor method

```ts
constructor(private configService: ConfigService) {}
```

Sử dụng trong class

```ts
// get an environment variable
const dbUser = this.configService.get<string>('DATABASE_USER');

// get a custom configuration value
const dbHost = this.configService.get<string>('database.host');
```

Có thể lấy all obj custom configuration -> sử dụng interface

```ts
interface DatabaseConfig {
    host: string;
    port: number;
}

const dbConfig = this.configService.get<DatabaseConfig>('database');

//you can now use `dbConfig.port` and `dbConfig.host`
const port = dbConfig.port;
```

Trả về giá trị mặc định nếu không tồn vại key

```ts
// Sử dụng "localhost" khi "database.host" không xác định
const dbHost = this.configService.get<string>('database.host', 'localhost');
```

Có optional generic (type argument) ngăn truy cạp thuộc tính không tồn tại

```ts
interface EnviromentVariables {
    PORT: number;
    TIMEOUT: string;

    //somewhere in the code
    constructor(private configService: ConfigService<EnviromentVariables>) {
        // Hợp lệ
        const port = this.configService.get<number>('PORT');

        // Không hợp lệ vì URL property không có trong EnviromentVariables interface
        const url = this.configService.get<string>('URL');
    }
}
```

## Configuration namespaces (Không gian tên cấu hình)

Trả về đối tượng cấu hình với một "namespaced" (không gian tên) như sau

```ts
export default registerAs('database', () => ({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT || 5432
}));
```

Load nó

```ts
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
    }),
  ],
})
export class AppModule {}
```

Lấy **host** từ **database** namespace -> sử dụng dot

```ts
const dbHost = this.configService.get<string>('database.host');
```

Các khác thay thế là đưa **database** namespace trực tiếp vào constructor

```ts
constructor(
  @Inject(databaseConfig.KEY)
  private dbConfig: ConfigType<typeof databaseConfig>,
) {}
```

## Partial registration (Đăng ký từng phần)

Cho phép load từng tệp config

```ts
import databaseConfig from './config/database.config';

@Module({
  imports: [ConfigModule.forFeature(databaseConfig)],
})
export class DatabaseModule {}
```

```diff
-WRANING
Một số trường hợp cần sử dụng onModuleInit() hook thay vì trong constructor -> nó chỉ chạy sau khi tất cả module nó dependency được khởi tạo
```

## Schema validation (Xác thực lược đồ)

Sủ dụng [Joi][Joi]

```bash
$ npm install --save @hapi/joi
$ npm install --save-dev @types/hapi__joi
```

Sử dụng thông qua thuộc tính **validatinSchema** của **forRoot()**

```ts
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
      }),
    }),
  ],
})
export class AppModule {}
```

Đảo ngược hai cài đặt trên -> sử dụng **validationOptions**

```ts
import * as Joi from '@hapi/joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test', 'provision')
          .default('development'),
        PORT: Joi.number().default(3000),
      }),
      validationOptions: {
        allowUnknown: false,
        abortEarly: true,
      },
    }),
  ],
})
export class AppModule {}
```

* **allowUnknown**:  Có cho phép các key không xác định trong biến môi trường hay không
* **abortEarly**: true -> đừng xác thực ở lỗi dầu tiên, false -> trả về all lỗi (default false)

## Custom getter functions (Các hàm getter tuỳ chỉnh)

Thêm **getter** function -> style code tốt hơn 

```ts
@Injectable()
export class ApiConfigService {
    constructor(private configService: ConfigService) {}

    get isAuthEnabled(): boolean {
        return this.configService.get('AUTH_ENABLEC') === 'true';
    }
}
```

Sử dụng getter function như sau:

```ts
@Injectable()
export class AppService {
  constructor(apiConfigService: ApiConfigService) {
    if (apiConfigService.isAuthEnabled) {
      // Authentication is enabled
    }
  }
}
```

## Expandable variables (Biến có thể mở rộng)

Tham chiếu biến lồng nhau

```ts
APP_URL=mywebsite.com
SUPPORT_EMAIL=support@${APP_URL}
```

Bật tính năng mở rộng

```ts
@Module({
  imports: [
    ConfigModule.forRoot({
      // ...
      expandVariables: true,
    }),
  ],
})
export class AppModule {}
```

## Using in the main.ts (Sử dụng trong main.ts)

Có thể dùng để lưu trữ các biến như cổng ứng dụng hoặc máy chủ CORS.

Để truy cập -> **app.get()** method -> tham chiếu service:

```ts
const configService = app.get(ConfigService);
```

Sau đó gọi **get** method và key config

```ts
const port = configService.get('PORT');
```



[Joi]: https://github.com/sideway/joi
