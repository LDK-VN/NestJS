# Custom route decorator (Tuỳ chỉnh trình trang trí tuyến đường)

Nest build -> dựa tính năng ngôn ngữ -> **decorator** -> read more [here][decorator]

## Param decorators (Trình trang trí tham số)

Danh sách decorators

* @Request() -> req
* @Response() -> res
* @Next() -> next
* @Session() -> req.session
* @Param(param?: string) -> req.params / req.params[param]
* @Body(param?: string) -> req.query / req.query[param]
* @Headers(param?: string) -> req.headers / req.headers[param]
* @Ip() -> req.ip

Có thể custom **decorator**


Giải nên **request** object

```ts
const user = req.user;
```

Làm cho nó dễ đọc -> @User() decorator -> sử dụng lại trên all controller

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        return request.user;
    }
)
```

Dùng nó ở bất kỳ đâu
```ts
@Get()
async findOne(@User() user: UserEntity) {
  console.log(user);
}
```

## Passing data (Truyền dữ liệu)

```ts
{
  "id": 101,
  "firstName": "Alan",
  "lastName": "Turing",
  "email": "alan@email.com",
  "roles": ["admin"]
}
```

Xác định decorator lấy tên thuộc tinh làm khoá và giá trị trả về được liênn kết nếu nó tồn tại (undefined or user object chưa được tạo)

```ts
user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user && user[data] : user;
  },
);
```

Sau đó truy cập vào một thuộc tính cụ thể thông qua trình `@User` decorator trong controller.

```ts
@Get()
async findOne(@User('firstName') firstName: string) {
    console.log(`Hello ${firstName}`);
}
```

## Working with pipes

```ts
@Get()
async findOne(@User(new ValidationPipe)) user : UserEntity) {
    console.log(user);
}
```

## Decorator composition (Thành phần trang trí)

Tạo nhiều decorator -> kết hợp decorator liên quan đến xác authentication -> only decorator

```ts
import { applyDecorators } from '@nestjs/common';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' }),
  );
}
```

Sau đó -> `@Auth` custom decorator

```ts
@Get('users')
@Auth('admin')
findAllUsers() {}
```






[decorator]: https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841

