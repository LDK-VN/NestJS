# Controllers
Handling incoming **requets** and returning **responses** to the client

![Controllers](https://github.com/LDK-VN/NestJS/blob/master/Resource/image/Controllers.png)


A Controllers -> mục địch -> nhận yêu cầu cụ thể cho ứng dụng

**Routing** kiểm soát controller -> nhận được request nào. Thường mỗi controller > 1 route và routes có thể thực hiện hành động khác nhau

Use classes and **decorators**. Decorator liên kết classes với required metadata(siêu dữ liệu bắt buộc) và cho phép  Nest tạo routing map (Liên kết request với controller tương ứng).

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

## Resources

```ts

// cat.controller.ts

import { Controller, Get, Post } from '@nestjs/common';

@Controller('cats')
export class CatsController {
  @Post()
  create(): string {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(): string {
    return 'This action returns all cats';
  }
}
```

HTTP endpoint  tiêu chuẩn: @Put(), @Delete(), @Patch, @Options(), @Head(), @All()

## Route wildcarrds

```ts
@Get('ab*cd')
findAll() {
    return 'This route uses a wildcard';
}
```

'ab*cd' -> abcd, ab_cd, abbecd,etc. Characters ?,+,*,() có thể được sử dụng in subsets.(-),(.) -> string-báed paths.

## Status code

Change status code.

```ts
@Post()
@HttpCode(204)
create() {
  return 'This action adds a new cat';
}
```

```
Import HttpCode from the @nestjs/common package.
```
Thường mã trạng thái không static -> phụ thuộc vào các yếu tố khác nhau -> có thể dùng response object dành riêng cho lib (ịnect @Res()) (Hoặc, trong case error -> throw)

## Headers

Chỉ định response header -> @Header() decorator or library-specific response object(res.header()).
```ts
@Post()
@Header('Cache-Control', 'none')
create() {
  return 'This action adds a new cat';
}
```

```
Import Header from the @nestjs/common package.
```

## Redirection (Chuyển hướng)

redirect URL -> @Redirect() or a library-specific response object (res.redirect()).

@Redirect() nhận required **url** argument, và optional **statusCode** argument default 302 (Found) nếu bị bỏ qua.
```ts
@Get()
@Redirect('https://nestjs.com', 301)
```

Muốn xác định HTTP status code or the redirect URL dynamically -> returning object  from the route handler method with the shape
```ts
{
  "url": string,
  "statusCode": number
}
```

Returns value -> override any argument được chuyển đến @Redirect()
```ts
@Get('docs')
@Redirect('https://docs.nestjs.com', 302)
getDocs(@Query('version') version) {
    if (version && version === '5') {
        return { url: 'https://docs.nestjs.com/v5/' };
    }
}
```

## Route parameters

Dynamic data -> route parameters in @Get() decorator and access with @Param() decorator.
```ts
@Get(':id')
findOne(@Param() params): string {
  console.log(params.id);
  return `This action returns a #${params.id} cat`;
}
```
```
Import Param from the @nestjs/common package.
```

Chuyển mã thông số cụ thể vào decorator -> tham chiếu trực tiếp route parameter trong method body.
```ts
@Get(':id')
findOne(@Param('id') id): string {
  return `This action returns a #${id} cat`;
}
```

## Sub-Domain Routing

The **@Controller** decorator -> có thể có một host option yêu cầu HTTP của các request phải khớp với một số giá trị cụ thể.
```ts
@Controller({ host: 'admin.example.com' })
export class AdminController {
  @Get()
  index(): string {
    return 'Admin page';
  }
}
```
```
WARNING
Since Fastify lacks support for nested routers, when using sub-domain routing, the (default) Express adapter should be used instead.
```

hosts option -> bắt dynamic value -> in host name -> use @HostParam() decorator
```ts
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getInfo(@HostParam('account') account: string) {
    return account;
  }
}
```

## Scopes

[Here][scope]

## Asynchronicity

Learn more about async / await feature [here][async]

async function -> Promise

```ts
// cat.controller.ts

@Get()
async findAll(): Promise<any[]> {
    return [];
}
```


Nest có thể -> return [observable streams][ovservable-streams] RxJS. Nest automatically subscribe and take the last emitted value (giá trị phát ra cuối cùng)
```ts
@Get()
findAll(): Observable<any[]> {
  return of([]);
}
```

Dùng 1 trong 2 cách tuỳ thuộc vào nhu cầu.

## Request payloads

Sử dụng **@Body** decoratorr
DTO schema (Đối tượng truyền dữ liệu) -> xác định cách dữ liệu được gửi qua mạng. Xác định DTO schema -> use TypeScript interface, class.
Nên sử dụng class -> class thuộc ES6 nên khi JS compiple -> giữ nguyên. TypeScript interface bị bỏ khi trannspilation => Nest không thể thâm chiếu đên chúng trong runtime.
Vì các tính năng như **Pipes** cho phép bổ khi chúng có quền truy cập metatype của biến trong runtime.

Create class **CreateCatDto** 
```ts
// create-cat.dto.ts
export class CreateDto {
    name: string;
    age: number;
    breed: string;
}
```

Dùng nó trong controller
```ts
@Post()
async create(@Body( createDto: CreateDto)) {
    return 'This action adds a new cat';
}
```

## Handdling error

Có một chương riêng về xử lý lỗi [here][handdle-error].

# Full resource sampel (Toàn bộ tài nguyên mẫu)

Một số ví dụ sử dụng decorator sẵn -> tạo base controller. Controller này đưa ra một số phương pháp để access vào thao tác dữ liệu nội bộ.

```ts
import { Controller, Get, Query, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { CreateCatDto, UpdateCatDto, ListAllEntities } from './dto';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Body() createCatDto: CreateCatDto) {
    return 'This action adds a new cat';
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} cat`;
  }
}
```

## Getting up and running

Nest không biết controller tồn tại -> cần khai báo controllers trong @Module()

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';

@Module({
  controllers: [CatsController],
})
export class AppModule {}
```

## Appendix: Library-specific approach

Sử dụng **response object** dành riêng cho lib -> use @Res() decorator

```ts
import { Controller, Get, Post, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('cats')
export class CatsController {
  @Post()
  create(@Res() res: Response) {
    res.status(HttpStatus.CREATED).send();
  }

  @Get()
  findAll(@Res() res: Response) {
     res.status(HttpStatus.OK).json([]);
  }
}
```

Mặc dù cách tiếp cận này hoạt động và trên thực tế cho phép linh hoạt hơn theo một số cách bằng cách cung cấp toàn quyền kiểm soát đối tượng phản hồi (thao tác tiêu đề, các tính năng dành riêng cho thư viện, v.v.), nó nên được sử dụng cẩn thận. Nhìn chung, cách tiếp cận này kém rõ ràng hơn nhiều và có một số nhược điểm. Những bất lợi chính là bạn mất khả năng tương thích với các tính năng Nest phụ thuộc vào việc xử lý phản hồi tiêu chuẩn của Nest, chẳng hạn như Bộ chặn và trình @HttpCode()trang trí. Ngoài ra, mã của bạn có thể trở nên phụ thuộc vào nền tảng (vì các thư viện cơ bản có thể có các API khác nhau trên đối tượng phản hồi) và khó kiểm tra hơn (bạn sẽ phải mô phỏng đối tượng phản hồi, v.v.).

Do đó, phương pháp tiếp cận tiêu chuẩn Nest phải luôn được ưu tiên khi có thể. (Đoạn kết nên copy hết (+.+))

[custom-decorators]: https://docs.nestjs.com/custom-decorators
[scope]: https://docs.nestjs.com/fundamentals/injection-scopes
[async]: https://kamilmysliwiec.com/typescript-2-1-introduction-async-await
[ovservable-streams]: http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html
[handdle-error]: https://docs.nestjs.com/exception-filters


