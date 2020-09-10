# Interceptors (Đánh chặn)

Class annotated (Chú thích)  -> '@Injectable()' decorator -> **NestInterceptor** interface.

<p align="center">
  <a href="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/interceptors.png" target="blank"><img src="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/interceptors.png" width="860" alt="interceptors" /></a>
</p>

Interceptors -> inspired [Aspect Oriented Programming][AOP](AOP)

* bind **extra logic** (logic bổ sung) before/after method execution(thực thi).
* **transform** result return from a function
* **transform** the exception thrown from a function
* **extend** the basic function behavior(hành vi)
* completely (hoàn toàn) **override** a function -> tuỳ vào mục đích cụ thể

## Basic

Each interceptor -> `intercept()` method -> 2 parameter (ExcutionContent, CallHandler)

## Execution context (Ngữ cảnh thực thi)

Extend **ArgumentsHost** -> about more [here][execution-context]

## Call handler

Đọc thêm ở trang chủ -> quá dài, quá khó hiểu (-.-)

## Aspect interception (Phương pháp đánh chặn)

The first use case -> lưu tữ các cuộc gọi người dùng, điều phối bất đồng bộ các sự kiện hoặc tính toàn dấu thời gian 

```ts
// logging.intercaptor.ts

import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators'

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before...');

    const now = Date.now();
    return next.handle().pipe(
      tap(() => console.log(`After... ${Date.now() - now}ms`),)
    );
  }
}
```

`handle()` return RxJS `Observable` 

## Bindding interceptors (Ràng buộc đánh chặn)

Have -> controller-scoped, method-scoped, global-scoped

```ts
// cats.controller.ts

@UseInterceptors(LoggingInterceptor)
export class CatsController {}
```

Passed -> **LoggingInterceptor** ( thay vì instance) -> tránh nhiệm khởi tạo do framework và có thể chèn dependency injection.

```ts
// cats.controller.ts

@UseInterceptors(new LoggingInterceptor())
export class CatsController {}
```

Scope a single method -> apply decorator -> **method level**

Apply interceptor global -> `useGlobalInterceptors()` method

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalInterceptors(new LoggingInterceptor());
```

Không thể injection dependency vì nó ở ngoài all module -> set up **diẻctly from any module**

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

## Reponse mapping (Ánh xạ phản hồi)

handle() -> return **Observable** -> value **returned** <- route handler => dễ thay đổi -> RxJS's `map()` operator(toán tử).

```diff
-WARNING
The response mapping feature doesn't work with the library-specific response strategy (using the @Res() object directly is forbidden(cấm))
```

`map()` -> gán obj response cho **data** của 1 obj mới dk tạo ra -> return obj đó cho client.

```ts
// transform.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => ({ data })));
  }
}
```

```diff
!HINT
Nó hoạ động với cả synchronous and asynchronous `intercept()` methods.
```

When call GET /cats -> endpoint

```ts
{
    "data": []
}
```

Interceptors -> tạo giải pháp -> tái sử dụng cho các requirements xảy ra trên toàn bộ ứng dụng.

ex: Đổi giá trị null -> ''

```ts
import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ExcludeNullInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(map(value => value === null ? '' : value ));
  }
}
```

## Exception mapping

Override throws exception -> `catchError()` of RxJS

```ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  BadGatewayException,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(
        catchError(err => throwError(new BadGatewayException())),
      );
  }
}
```

## Stream overriding

Ngăn hoàn toàn biệc gọi trình xử lý thanh vào  đo return về một giá trị khác.

```ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      return of([]);
    }
    return next.handle();
  }
}
```

Have **isCached** variable hardcoded(mã hoá cứng) -> hardcoded response
Return stream new -> with `of()` operator RxJS -> router handler **won't be called** (Sẽ không được gọi).
...
Đọc thêm trang chủ

## More operators (Các toán tử khác)

Ví dụ: handle **timeouts** on route requests -> endpoint không return anything -> response error

```ts
// time.interceptor.ts

import { Injectable, NestInterceptor, ExecutionContext, CallHandler, RequestTimeoutException } from '@nestjs/common';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(5000),
      catchError(err => {
        if (err instanceof TimeoutError) {
          return throwError(new RequestTimeoutException());
        }
        return throwError(err);
      }),
    );
  };
};
```
Sau 5s -> canceled request processing -> có thể thêm logic trước khi throwing **RequestTimeoutException** (giải phóng tài nguyên)

[AOP]: https://en.wikipedia.org/wiki/Aspect-oriented_programming
[execution-context]: https://docs.nestjs.com/fundamentals/execution-context