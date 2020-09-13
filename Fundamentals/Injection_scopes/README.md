# Injection scopes

## Provider scope

<p align="center">
  <a href="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/provider_scope.png" target="blank"><img src="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/provider_scope.png" width="860" alt="provider scope" /></a>
</p>

### Usage

Chỉ định bằng cách chuyển property **scope** cho @Ịnectable() decorator options object

```ts
import { Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.REQUEST })
export class CatsService {}
```

Với custom providers

```ts
{
  provide: 'CACHE_MANAGER',
  useClass: CacheManager,
  scope: Scope.TRANSIENT,
}
```

Singleton scope -> default -> không cần khai báo
Nếu muốn khai báo -> **Scope.DEFAULT**

### Controller scope

Khai báo **scope** -> **ControllerOptions** object;

```ts
@Controller({
  path: 'cats',
  scope: Scope.REQUEST
})
export class CatsController {}
```

## Request provder

Trong HTTP server-based application -> tham chiếu object yêu cầu ban đầu khi sử dụng providers scope -> inject **REQUEST** obj

```ts
import { Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class CatsService {
  constructor(@Inject(REQUEST) private request: Request) {}
}
```

Trong các ứng dugnj **GraphQL** -> Chèn 'CONTEXT' thay vì 'REQUEST'.

```ts
import { Injectable, Scope, Inject } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';

@Injectable({ scope: Scope.REQUEST })
export class CatsService {
  constructor(@Inject(CONTEXT) private context) {}
}
```
