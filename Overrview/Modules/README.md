# Modules

Class được chú thích bằng **@Module** decorator. **@Module()** decorator provides metadata mà **Nest** sử dụng để organize (tổ chức) the application structure (cấu trúc ứng dụng).

<p align="center">
  <a href="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/module.png" target="blank"><img src="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/module.png" width="860" alt="module" /></a>
</p>

Mỗi application -> ít nhất 1 module -> **root module** -> build **application graph** (Biểu đồ ứng dụng)

The @Module() decorator takes a signle object whose properties describe the module:

* providers     -> the providers -> instantiated (tạo ra) bởi Nest injector và có thể được shared trên module này
* controllers   -> controllers defined phải được khởi tạo trong this module
* imports       -> the list of imported modules that export the providers which are required in this module
* exports       -> the subset (tập con) của **providers** được cung cấp bởi this module và sẽ có sẵn trong các module khác import this module

Có thể coi providers from a module là module's public interface,or API.

## Feature modules

Đơn giản là "organizes code relevant" (Tổ chức mã phù hợp) với mọt function cụ thể -> keep code organized và establishing clear boundaries (thiết lập danh giới rõ ràng) => Quản lý sự phức tạp  + phát triển với nguyên tắc SOLID đăc biệt -> quy mô app tăng.

```ts
// cats/cats.module.ts

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
    controllers: [CatsController],
    providers: [CatsService]
})
export class CatsModule {} 
```

Create a module using the CLI
```bash
$ nest g module cats
```

Import vao **root module** (AppModule defined trong app.module.ts)

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule]
})
export class AppModule {}

```
Directory structure
<p align="center">
  <a href="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/module-structure.png" target="blank"><img src="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/module-structure.png" width="860" alt="module" /></a>
</p>

## Shared modules

Default -> modules are **singletons** -> share same instance of any provider between multiple modules effortlessly(dễ dàng).
<p align="center">
  <a href="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/sharedmodule.png" target="blank"><img src="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/sharedmodule.png" width="860" alt="module" /></a>
</p>


Mỗi module là automatically a **shared module**. Sau khi tạo -> sử dụng -> all module.

```ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService]
})
export class CatsModule {}
```

Any module imports **CatsModule** đều có thể access **CatsService** -> share the same instance với tất cả module khác đều có thể import it as well

## Module re-exporting (Tái xuất module)

Có thể re-export module đã import
```ts
@Module({
  imports: [CommonModule],
  exports: [CommonModule],
})
export class CoreModule {}
```

## Dependency injection

A module class can **inject** providers as well (e.g., configuration purposes -> mục đích cấu hình)

```ts
// cat.module.ts

import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
    controllers: [CatsController],
    providers: [CatsService],
})
export class CatsModule {
    constructor(private catsService: CatsService) {}
}
```

However, bản thân module classes không thể injected as providers do [circular dependency][circular-dependency]

## Global module

Cung cấp provider sẵn global -> use **@Global** decorator

```ts
import { Module, Global } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

@Global()
@Module({
    controllers: [CatsController],
    providers: [CatsService],
    exports: [CatsService]
})
export class CatsModule {
    constructor(private catsService: CatsService) {}
}

```

**@Golobal** decorator làm cho module global-scoped -> chỉ đăng ký 1 lần, thường là root or core module.

```diff
!HINT
Golobal module không phải design good -> nên sử dụng **import** -> chi tiết đọc thêm trang chủ nestjs
```

## Dynamic modules

Cho phép dễ dàng tạo các module tuỳ chỉnh có thể đăng ký và configure providers dynamically (Cấu hình động nhà cung cấp). Chi tiết [here][dynamic-module]

```ts
import { Module, DynamicModule } from '@nestjs/common';
import { createDatabaseProviders } from './database.providers';
import { Connection } from './connection.provider';

@Module({
    providers: [Connection],
})
export class DatabaseModule {
    static forRoot(entities = [], options?) : DynamicModule {
        const providers = createDatabaseProviders(options, entities);
        return {
            module: DatabaseModule,
            providers: providers,
            exports: providers
        }
    }
}
```

```diff
!HINT
The **root()** method có thể return về 1 dynamic module hoặc synchronously or asynchronously (i.e., thông qua một **Promise**)
```
If want register a dynamic module in the global scope -> set **global** property thành true.

```ts
  {
    global: true,
    module: DatabaseModule,
    providers: providers,
    exports: providers
  }
```

```diff
-WARNING
As mentioned above, making everything global is not a good design decision.(global không design tốt)
```

The **DatabaseModule** can be imported and configured theo cách sau:

```ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './entity/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
})
export class AppModule {}
```

Nếu muốn re-export a dynamic module -> bỏ qua forRoot() method call in the exports array

```ts
import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { User } from './entity/user.entity';

@Module({
  imports: [DatabaseModule.forRoot([User])],
  exports: [DatabaseModule],
})
export class AppModule {}
```


[circular-dependency]: https://docs.nestjs.com/fundamentals/circular-dependency
[dynamic-module]: https://docs.nestjs.com/fundamentals/dynamic-modules