# Middleware

* Middleware is a function -> call **before** the route handler
* Have access to the **request** and **response** object, and the **next()** middleware function -> application's request-response cycle
* The **next()** middleware function -> variable name **next**

### Chức năng

* execute any code.
* make changes to the  request and response objects
* end the request-response cycle.
* call the next middleware function in stack
* current middleware function -> not end the request-response cycle -> must call **next()** -> pass control next middleware function. Otherwise (nếu không), the request will be left hanging (request bị treo "cổ").

Implement custom Nest middleware -> function, class -> **@Injectable()** decorate. Class should implement **NestMiddleware** interface -> when not requirements.

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Request, next: Function) {
    console.log('Request...');
    next();
  }
}
```

## Dependency injection 

inject dependencies -> **constructor**

## Applying middleware (Áp dụng phần mệm trung gian)

No place in the **@Module()** decorator -> Set them -> **configure()** method of the module class -> Implement **NestModule** interface -> Set up the **LoggerMiddleware** the the **AppModule** level.

```ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      .forRoutes({path: 'cats', method: RequestMethod.GET});
  }
}
```

```diff
!HINT
configure() method can be made (thực hiện) asynchronous using **async/await**
```

## Route wildcards (Ký tự đại diện định tuyến)

Asterisk (Dấu hoa thị) used -> wildcard -> match bất kỳ tổ hợp ký tự nào.

```ts
forRoutes({ path: 'ab*cd', method: RequestMethod.ALL });
```

'ab*cd' -> abcd, ab_cd, abecd,etc. The charaters ?, +, * and () may be used in a route path.

```diff
-WARNING
Fastify -> not support * -> used (.*), :splat*.
```

## Middleware consumer

**Middleware consumer** is a helper(Người trợ giúp) class -> phương pháp -> quản lý middleware. (Đọc thêm chi tiết ở trang chủ)

```ts
import { Module, NestModule, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { LoggerMiddleware } from './logger.middleware';
import { CatsController } from './cats/cats.controller';
import { CatsModule } from './cats/cats.module';

@Module({
  imports: [CatsModule]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      .forRoutes(CatsController); // có thể có nhiều controller phân tách nhau bằng giấu phẩy
  }
}
```

```diff
The **apply()** method -> take a single middleware, multiple arguments để sác định multiple middleware.
```

## Excluding routes

Used **exclute()** method -> loại trừ một số routes sử dụng middleware

```ts
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware)
      .exclude(
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
        'cats/(.*)',)
      .forRoutes(CatsController)
  }
```

```diff
!HINT
The excule() method supports wildcard(Ký tự đại diện) parameters using -> 'path-to-regexp' package
```

## Functional middleware

Có thể defined middleware trong một function đơn giản thay vì một class -> **functional middleware**

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

export function logger(req: Request, res: Response, next: Function) {
  console.log('Request...');
  next();
}
```

```ts
consumer
  .apply(logger)
  .forRoutes(CatsController);
```

```diff
!HINT
Consider(cân nhắc) using the simpler (đơn giản hơn) 'functional middleware' thay thế -> middleware -> doesn't need any dependencies.
```

## Multiple middleware

Bind multiple middleware  -> executed sequentially (thực thi tuần tự) -> list innside (tách nhau bằng giấu phẩy nhé) the **apply()** method.

```ts
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

## Global middleware

If you want bind middleware to every reigstered route (đăng ký với mọi tuyến đường) at once (cùng 1 lúc) -> **use()** method supplied(cung cấp) by **INestApplication**

```ts
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```
