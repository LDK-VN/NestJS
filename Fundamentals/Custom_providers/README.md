# Custom providers (Nhà cung cấp tuỳ chỉnh)

## DI Fundamentals (Các nguyên tắc DI cơ bản)

Dependency injection (DI) -> inversion of control(IoC) technique (kỹ thuật) ->  delegate(uỷ nhiệm) -> dependencies -> vào IoC container (the NestJS runtime system)

First -> define a provider (xác định một nhà cung cấp) -> The **@Injectable()** decorator marks(đánh dấu) -> **CatsService** class là provider.

```ts
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  findAll(): Cat[] {
    return this.cats;
  }
}
```

Then -> inject provider -> controller class:

```ts
import { Controller, Get } from '@nestjs/common';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

Finally -> reigster provider -> with Nest IoC container:

```ts
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { CatsController } from './cats/cats.controller';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}

```

What happen? :confused:

3 Step

1. In **cats.service.ts**, the **@Injectable()** decorator -> Declared (khai báo) -> **CatsService** class -> maybe managed -> Nest IoC container.

2. In **cats.controllers.ts**, the **CatsController** -> Declared a dependency (khai báo sự phụ thuộc) -> **CatsService** token -> constructor injection:

```ts
constructor(private catsService: CatsService)
```

3. In **app.module.ts** -> associate (liên kết) -> token **CatsService** with **CatsService** class from **cats.service.ts**


## Standard providers

Closer look `@Module()` decorator in **app.module**

```ts
@Module({
  controllers: [CatsController],
  providers: [CatsService]
})
```

The **providers** property takes an array of **providers**  (Tài sản của một loạt các nhà cung cấp ).

Supplied (cung cấp) providers thông qua list of class name (danh sách tên các lớp).

Syntax provviders: [CatsService] -> more complete synxtax (cú pháp hoàn chỉnh hơn)

```ts
providers: [
  {
    provide: CatsService,
    useClass: CatsService,
  },
];
```

## Custom providers ( Tuy chỉnh nhà cung cấp)

### Value providers: useValue

**useValue** syntax -> useful (hữu ích) -> injecting a constant value (tiềm một hằng số), putting (đặt) external library (thư viện bên ngoài) -> Nest container, or replacing (thay thế) -> real implementation (thực hiện)  with a mock object (object fake) :expressionless: (hiểu không nào)


```ts
import { CatsService } from './cats.service';

const mockCatsService = {
  /* mock implementation
  ...
  */
};

@Module({
  imports: [CatsModule],
  providers: [
    {
      provide: CatsService,
      useValue: mockCatsService,
    },
  ],
})
export class AppModule {}
```

## Non-class-based provider tokens (Mã thông báo nhà cung cấp không dựa trên class)

In this example -> **CatsService** token -> resolve (phân giải) -> **mockCatsService** mock object.

```ts
@Module({
  imports: [],
  controllers: [AppController, CatsController],
  providers: [
    {
      provide: 'CONNECTION',
      useValue: mockCatsService.CAT,
    },
    AppService],
})
```

Ví dụ này liên kết string-valued(giá trị chuôi) token ('CONNECTION') với một **connection** object

```diff
+NOTE
Có thể dùng ký hiệu JS làm token value
```


Dependency -> declared (khai báo) với một class name -> injection provider
```ts
@Injectable()
export class CatsRepository {
  constructor(@Inject('CONNECTION') connection: Connection) {}
}
```

## Factory providers: useFactory

**useFactory** syntax -> tạo providers **dynamically** (tự động)

provider -> supplied (cung cấp) -> value reutned <- factory function

Simple factory (Nhà máy đơn giản) -> not depend (không phụ thuộc) -> any providers (bất kỳ nhà cung cấp nào).
Complex factory (Nhà máy phức tạp) -> inject other provider (tiêm các nhà cung cáp khác) -> cần để tính toán kết quả của nó.

1. Factory function -> 2 parameter
2. **inject** -> accept an array of providers (nhận mảng các trình cung cấp) -> Nest resolve (phân giải) -> pass arguments -> factory function trong quá trình khởi tạo. 

```ts
const connectionFactory = {
  provide: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseConnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionFactory],
})
export class AppModule {}
```

## Alias providers: useExisting

**useExisting** syntax -> create aliases(biệt hiệu) cho providers hiện có => 2 cách access same provider (cùng nhà cung cấp).

```ts
@Injectable()
class LoggerService {
  /* implementation details */
}

const loggerAliasProvider = {
  provide: 'AliasedLoggerService',
  useExisting: LoggerService,
};

@Module({
  providers: [LoggerService, loggerAliasProvider],
})
export class AppModule {}
```

## Non-service based providers (Các nhà cung cấp không dựa trên dịch vụ)

Providers -> supply **any** value

```ts
const configFactory = {
  provide: 'CONFIG',
  useFactory: () => {
    return process.env.NODE_ENV === 'development' ? devConfig: prodConfig;
  },
};

@Module({
  providers: [configFactory],
})
```

## Export custom providers (Xuất các nhà cung cấp tuỳ chỉnh)

custom provider -> scoped declaring module (phạm vi khai báo module)
Visible to other modules (Hiển thị với các module khác) -> exported => use token or full provider object (Toàn bộ đối tượng nhà cung cấp).

```ts
const connectionFactory = {
  provider: 'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    returnnew DatabaseConnection(options);
  },
  inject: [OptionsProvider],
}

@Module({
  providers: [connectionFactory],
  exports: ['CONNNECTION'],
})
export class AppModule {}
```

Full provider object

```ts
const connnectionFactory = {
  provider:'CONNECTION',
  useFactory: (optionsProvider: OptionsProvider) => {
    const options = optionsProvider.get();
    return new DatabaseCOnnection(options);
  },
  inject: [OptionsProvider],
};

@Module({
  providers: [connectionFactory],
  exports: [connectionFactory],
})
export class AppModule {}
```

