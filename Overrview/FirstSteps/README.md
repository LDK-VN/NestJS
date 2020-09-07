# First steps

## Language

* TypeScript (default)
* Javascript

## Setup

Tạo new project với Nest CLI

```bash
$ npm i -g @nest/cli
$ nest new project-name
```

Tổng quát về các tệp cốt lõi

```
app.controller.ts | Basic controoler sample with a single route
app.module.ts     | The root module of the application.
main.ts           | The entry file of the application which uses the core function NestFactory to create a Nest application instance.
```
**main.ts** bao gồm một function async -> bootstrap out of application

Tạo Nest application instance -> using core NestFactory class -> hiển thị vài method static -> tạo một application instance
method `create()` return application object, đáp ứng các INestApplication interface

Start Http listener -> chophesp ứng dụng chờ gửi yêu cầu HTTP gửi đến
```ts
import { NestFactory } from '@nestjs/core';
import { AppMoule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
}
bootstrap();
```

## Platform

Nest -> mục tiêu platform-agnostic framework => Platform độc lập giúp tạo các phần logic có thể tái sử dụng -> developer có thể tận dụng trên một số loại ứng dụng khác nhau

Nest -> tạo adapter -> hoạt động với bất kỳ Node HTTP framework

Có 2 platform support out-of-the-box: express and fastify.

```
platform-express | Express là một framework tối giản web cho node. Là 1 sản xuất với nhiều tài nguyên do cộng đồng thực hiện. `@nestjs/platform-express` package used default.

platform-fastify | Fastify hiệu suất cao, chỉ phí tập -> focus hiệu quả + tốc độ
```

Intance tương ứng
* Express: NestExpressApplication
* Fastify: NestFastifyApplication

Với nền tảng khác nhau -> method sẽ khác nhau
```ts
// Express
const app = await NestFactory.create<NestExpressApplication>(AppModule);

// Fastify
const app = await NestFactory.create<NestFastifyApplication>(AppModule);
```