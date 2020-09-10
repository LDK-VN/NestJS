# Guards (Lính canh)

 Class Annotated (chú thích) the `@Injectable()` decorator -> implement **CanActivate** interface.

<p align="center">
  <a href="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/guards.png" target="blank"><img src="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/guards.png" width="860" alt="guards" /></a>
</p>

Single responsibility (Trách nhiệm duy nhất) -> Check request có được handled bởi route handler hay không -> phụ thuộc permissions, roles, ACLs,etc -> hiện có tại run-time.

This have access **ExecutionContext** instance -> biết điều gì sẽ xảy ra tiếp theo.

```diff
!HINT
Guards exe sau each middleware, trước any interceptor (đánh chặn) or pipe(đường ống).
```

## Authorization guard (Uỷ quyền bảo vệ)

**Authorization** great -> because -> routes khả dụng -> caller (người gọi) có đủ permissions.

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

`validateRequest()` -> guards fit với request/response cycle.

Every guard -> canActive() function -> return -> boolean ->  được phép hay không.

* true -> request will be processed (Yêu cầu sẽ được xử lý)
* false -> request will deny(từ chối) the request

## Execution context

`canActive()` take a single argument (lý do duy nhất), **ExecutionContext** instance -> extend **ArgumentsHost** -> about more [here][execution-context]

## Role-based authentication (Xác thực dựa trên vai trò)

build functional guard hown chỉ cho phép access vào người dùng có vai trò cụ thể.

```ts
// role.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return true;
  }
}
```

## Bindding guards (Bảo vệ ràng buộc)

Guards -> **controller-scoped** -> method-scoped, global-scoped -> using `@UseGuards()` decorator -> nhận một argument, list argument tách nhau bằng dấu phẩy

```ts
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```

Pass an in-place instance (Chuyển một thê hiện tại chỗ)

```ts
@Controller('cats')
@UseGuards(new RolesGuard)
export class CatsController {
    @Get()
    findAll(): string {
        return 'This is method get';
    }
}
```

single method -> Apply **@UseGuards()** decorator -> **method level**

global guard -> Apply **useGlobalGuards()** method

```ts
const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new RolesGuard);
```

```diff
+NOTE
In the case of hybrid apps the useGlobalGuards() method doesn't set up guards for gateways and micro services by default (see Hybrid application for information on how to change this behavior). For "standard" (non-hybrid) microservice apps, useGlobalGuards() does mount the guards globally.

--> đại loại là không bảo vệ cho micro services và gateways(cổng)  trừ microservices (non-hybrid)
```

set up guard -> all module

```ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

## Setting roles per handler (Đặt vai trò cho mỗi trình xử lý)

Để biết về các roles -> một số cho admin user , còn lại có thể cho all => using **custom metadata** with `@SetMetadata()` decorator.

```ts
// cat.controller.ts
@Post()
    @SetMetadata('roles', ['admin'])
    async create(@Body() createCatDto: createCatDto) {
      this.catsService.create(createCatDto);
    }
```

Tuy cụ thể nhưng không nên dùng trực tiếp

```ts
import { SetMetadata } from '@nestjs/common';

export const Role = (...args: string[]) => SetMetadata'role', args);
```

Các này rõ ràng và dễ đọc hơn

```ts
@Post()
@Roles('admin')
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

## Putting it all together (Kết hợp tất cả lại với nhau)

Using **Reflector** helper class -> access the route's role (vai trò của tuyển đường ) (custom metadata)

```ts
// role.guard.ts

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return matchRoles(roles, user.roles);
  }
}
```

Không không có đủ đặc quyền -> Nest return response:

```JSON
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

Guard return false -> throw **FobiddenExxception**.
Return different error response -> throw exception different

```ts
throw new UnauthorizedException();
```
Any exception throw bởi guard -> handled by **exceptions layer**

[execution-context]: https://docs.nestjs.com/fundamentals/execution-context
