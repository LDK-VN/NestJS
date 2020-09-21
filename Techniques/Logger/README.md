# Logger (Tiều phu)

Trình ghi nhật ký dựa trên văn bản được tích hợp sẵn -> khi khởi động ứng dụng hoặc hiển thị ngoại lệ
* Vô hiệu hoá hoàn toàn ghi nhật ký
* Chỉ định mức độ chi tiết của nhật ký (lỗi hiển thị, cảnh báo, thông tin gỡ lỗi)
* Ghi đè hoàn toàn trình ghi mặc định
* Tuỳ chỉnh trình ghi mặc định bằng cách mở rộng nó
* Sử dụng phụ thuôc để đơn giản hoá việc soạn thảo và kiểm tra ứng dụng

## Basic customization (Tuỳ chỉnh cơ bản)

Disable ghi nhật ký -> set logger=false

```ts
const app = await NestFactory.create(ApplicationModule, {
  logger: false,
});
await app.listen(3000);
```

Enable cấp độ ghi nhật ký cụ thể

```ts
const app = await NestFactory.create(ApplicationModule, {
  logger: ['error', 'warn'],
});
await app.listen(3000);
```

## Custom implementation (Triển khai tuỳ chỉnh)


```ts
const app = await NestFactory.create(ApplicationModule, {
  logger: console,
});
await app.listen(3000);
```

```ts
import { LoggerService } from '@nestjs/common';

export class MyLogger implements LoggerService {
  log(message: string) {
    /* your implementation */
  }
  error(message: string, trace: string) {
    /* your implementation */
  }
  warn(message: string) {
    /* your implementation */
  }
  debug(message: string) {
    /* your implementation */
  }
  verbose(message: string) {
    /* your implementation */
  }
}
```

Cung cấp phiên bản của **MyLogger** thông qua **logger** property

```ts
const app = await NestFactory.create(ApplicationModule, {
  logger: new MyLogger(),
});
await app.listen(3000);
```

## Extend built-in logger (Mở rộng trình ghi nhật ký tích hợp sẵn)

```ts
import { Logger } from '@nestjs/common';

export class MyLogger extends Logger {
  error(message: string, trace: string) {
    // add your tailored logic here
    super.error(message, trace);
  }
}
```

## Dependency injection (Tiêm phụ thuộc)

```ts
import { Module } from '@nestjs/common';
import { MyLogger } from './my-logger.service';

@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule {}
```

Dùng **get** để lấy singleton íntance của **MyLogger** object
```ts
const app = await NestFactory.create(ApplicationModule, {
  logger: false,
});

app.useLogger(app.get(MyLogger));
await app.listen(3000);
```

## Using the logger for application logging (Sử dụng trình ghi nhật ký để ghi nhật ký ưng dụng)

1 Mở rộng trình ghi nhật ký tích hợp và tuỳ chỉnh **context** phần thông báo nhật ký

```bash
[Nest] 19096   - 12/08/2019, 7:12:59 AM   [NestFactory] Starting Nest application...
```

2. Đưa phiên bản tạm thời **Logger** module tính năng -> để mỗi module có ngữ cảnh tuỳ chỉnh riêng.
3. Cung cấp trình ghi nhật ký mở rộng để Nest sử dụng ghi nhật ký hệ thống.

Cung cấp **scope** truỳ chọn dưới dạng metadata cấu hình cho **Logger** class

```ts
import { Injectable, Scope, Logger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class MyLogger extends Logger {}
```

Tạo **LoggerModule** với cấu trúc sau:

```ts
import { Module } from '@nestjs/common';
import { MyLogger } from './my-logger.service';

@Module({
  providers: [MyLogger],
  exports: [MyLogger],
})
export class LoggerModule {}
```

Import **LoggerModule** vào module tính năng của bạn. Sau đó đặt ngữ cảnh của trình ghi nhật ký và sử dụng trình ghi nhật ký tuỳ chỉnh nhận biết ngữ cảnh

```ts
import { Injectable } from '@nestjs/common';
import { MyLogger } from './my-logger.service';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  constructor(private myLogger: MyLogger) {
    this.myLogger.setContext('CatsService');
  }

  findAll(): Cat[] {
    this.myLogger.warn('About to return cats!');
    return this.cats;
  }
}
```

Cuối cùng, sử dụng nó trong files **main.ts**

```ts
const app = await NestFactory.create(ApplicationModule, {
  logger: false,
});
app.useLogger(new MyLogger());
await app.listen(3000);
```

## Use external logger

Có thể sử dụng trình ghi logger chuyên dụng như [Winstom](https://github.com/winstonjs/winston)