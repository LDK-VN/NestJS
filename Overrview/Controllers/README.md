# Controllers
Handling incoming **requets** and returning **responses** to the client

![Controllers](https://github.com/LDK-VN/NestJS/blob/master/Resource/image/Controllers.png)


A Controllers -> mục địch -> nhận yêu cầu cụ thể cho ứng dụng

**Routing** kiểm soát controller -> nhận được request nào. Thường mỗi controller > 1 route và routes có thể thực hiện hành động khác nhau

Use classes and **decorators**. Decorator liên kết classes với required metadata(siêu dữ liệu bắt buộc) vàcho phép  Nest tạo routing map (Liên kết request với controller tương ứng).

## Routing

Define a basic controller -> @Controller() decorator
Path prefix in @Controller() decorator -> Nhóm routes liên quan, minimize repetitive code (giảm code lặp)

```ts
// cat.controller.ts
import { Controller , Get } from '@nestjs/common';

@Controller('cats)
export class CatsController {
    @Get()
    findAll(): string {
        return 'This action returns all cats
;    }
}
```

<<<<<<< HEAD
* Create a controller using the CLI
```bash
 @nest g controller cats`
```

Route path -> Nối tiền tố (optional) -> được khai báo -> controller, bata kỳ path chỉ định trong request decorator. 

```
EX: path prefix (tiền tố đường dẫn) "customers" + "@Get('profile')" => "GET /customers/profile"
```

Có 2 kiểu response

```
Standard (recommended) | response -> obj, array js -> serialized về JSON . Tuy nhiên Nest chỉ send value mà không cố gắng serialize, còn lại Nest lo  => Xử lý phản hồi ez, 

Library-specific (thư việc cụ thể) | ex: express -> @Res() in method (findAll(@Res)() reponse) -> có khả năng sử dụng các phương pháp xử lý phản hồi "response.status(200).send()"
=======
```
Create a controller using the CLI -> `@nest g controller cats`
>>>>>>> 1f24d6c9d9123777522627d0cd55f4f9d19641e3
```

* Không thể dùng cả 2 cách cùng lúc. Nest biết -> handler dùng @Res() hay @Next() -> cho biết đó là tuỳ chọn dành riêng cho lib. -> Dùng 2 cách => standard disable

## Request Object

Handlers -> access client request detail. Nest cung cấp quyền access **request object** => thêm **@Req()** decorator vào handler's 

```ts
import { Controller, Get, Req } from '@nestjs/common';
import { Request } from 'express';


@Controller('cats')
export class CatsController {
    @Get()
    findAll(@Req() request: Request): string {
        return ' This action returns all cats';
    }
}
```

Tận dụng **express** typings (as in the request: Request parameter), install "@types/express" package.

Dùng dedicated decorators -> @Body(), @Query() -> get request query string, parameters, HTTP headers, and body

```
@Request() -> req
@Request(), @Res()* -> res
@Next() -> next
@Session() -> req.session
@Param(key?: string) -> req.params/req.params[key]
@Body(key?: string) -> req.body/req.body[key]
@Query(key?: string) -> req.query/req.query[key]
@Headers(name?: string) -> req.headers/req.header[name]
@Ip() -> req.ip
```

Nếu sử dụng lib -> response management -> cal **response** object (res.json(), res.send()) -> ko máy chủ treo

```
Tìm hiểu create, [custom decorators][custom-decorators]
```

[custom-decorators]: https://docs.nestjs.com/custom-decorators

