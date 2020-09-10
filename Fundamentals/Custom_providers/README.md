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