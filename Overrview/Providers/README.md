# Providers

Dùng để inject dependencies -> các obj có thể toạ nhiều quan hệ -> wiring up các cá thể của đối tượng phần lớn có thể được ủy quyền cho Nest runtime system.

Provider đơn giản là class + @Ijnectable decorator

<p align="center">
  <a href="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/Components_1.png" target="blank"><img src="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/Components_1.png" width="320" alt="Nest Logo" /></a>
</p>

## Services

Tạo **CatsService** -> Lưu trữ + truy xuất dữ liệu, được design sử dụng bởi **CatsController**

```ts
// cats.service.ts
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
```

Create service with **CLI**
```
$ nest g service cats
```


Using interface **Cat** like this:

```ts
//inbterfaces/cat.interface.ts
export interface Cat {
    name: string;
    age: number;
    breed: string;
}
```

Dùng nó trong **CatsController**

```ts
// cats.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

**CatService** injected qua class constructor

## Dependency injection

Trả về instance của CatsService -> gán thuộc tính trong constructor

```ts
constructor(private catsService: CatsService) {}
```

## Scope

Provider thường có lifetime("scope") đồng bộ với application lifecycle. App run -> mọi dependency phải dk giải quyết do đó tất cả provider được khởi tạo. tương tự khi tắt
Có nhiều cách để làm cho provider lifetime **request-scoped** as well (Mu muội). More about [here][scope]


## Custom providers

@Ịnectable() decorator không phải là cách duy nhất xác định provider. Thực tế cso thể dùng các plain values, classes, and either asynchronous or synnchronous factories. Read more [here][custom-providers]

## Optional providers

Một số case không cần dependency dk giải quyết. Ex: class có thể dependency vào một **configuration ọbject**, nhưng nếu không có ọbj nào dk truyền -> sử dụng default values. Dependency bây giừo là optional => ko có error

Dùng @Optional() decorator để chỉ ra provider optional. More about providers[here][optional-providers]

```ts

```

```diff
-WARNING
If your class doesn't extend another provider, you should always prefer using constructor-based injection. (Nếu class không mở rộng another provider khác thì nên dùng method ịnection trên thằng constructor)
```

## Provider registration

Có 1 nhà cung cấp (CatsService) + 1 khác hàng tiềm năng (CatsController) -> giờ cần nhà cung cấp cần đăng ký với Nest để được inject(tiêm chủng) => Sửa module (app.module.ts) và thêm service vào array **providers** của **@Module** decorator

```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

Và đây là directory structure:


## Manual instantitation

Nhận các phiên bản hiện có or khởi tạo động các provider -> [Module reference][module-reference]

Để có provider trong bootstrap() function (ex: các app độc lập không có controller hoặc tận dụng configuration service trong quá trình khởi động) see [Standalone applications][standalone-application].

[scope]: https://docs.nestjs.com/fundamentals/injection-scopes
[custom-providers]: https://docs.nestjs.com/fundamentals/custom-providers
[optinal-providers]: https://docs.nestjs.com/fundamentals/custom-providers
[module-reference]: https://docs.nestjs.com/fundamentals/module-ref
[standalone-application]: https://docs.nestjs.com/standalone-applications