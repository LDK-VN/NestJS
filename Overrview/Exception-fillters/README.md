# Exception filters (Bộ lọc ngoại lệ)
<p align="center">
  <a href="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/exception.png" target="blank"><img src="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/exception.png" width="320" alt="Nest Logo" /></a>
</p>

Nest đi kèm -> **exception layer** -> handle all exception chưa được khắc phục trên app.
Ngoài ra còn -> **global exceptionn filter** -> handle bởi **HttpException** (và class con của nó). Khi exception unrecognized => tạo response JSONN default:

```JSON
{
    "statusCode":500,
    "mesage":"Internal server error"
}
```

## Throwing standard exceptions (Ném các ngoại lệ tiêu chuẩn)

Nest cung cấp built-in -> **HttpException** class -> từ **@nestjs/common** package.
HTTP REST/GraphQL API -> nên send HTTP response object khi có lỗi

```ts
@Get()
async findAll() {
    throw new HttpException('Forbidden',HttpStatus.FORBIDDEN);
}
```

result
```JSON
{
    "statusCode":403,
    "message": "Forbidden"
}
```

Function **HttpException** -> 2 parameter
* response xác định nội dung JSON response -> là 'string' or 'object'
*  status -> xác định HTTP status code

Default JSON response body -> 2 properties:
* statusCode: default HTTP status code dk cung cấp trong status argument
* message: Mô tả ngắn gọn về error HTTP dự trên **status**

Ghi đè content JSON response -> cung cấp chuỗi trong **response** argument
Ghi đè toàn bộ content JSON response -> truyền obj vào **response** argument

Đối số phương thức khởi tạo thứ 2 - status - phải là HTTP status code hợp lệ. Tôt nhất là dùng **HttpStatus** enum từ @nestjs/common.

ex: ghi đè toàn bộ content response
```ts
//cat.controller.ts
@Get()
async findAll() {
  throw new HttpException({
    status: HttpStatus.FORBIDDEN,
    error: 'This is a custom message',
  }, HttpStatus.FORBIDDEN);
}
```

result
```JSON
{
  "status": 403,
  "error": "This is a custom message"
}
```

## Custom exceptions

Nếu custom exceptionns -> tạo exceptions hierarchy (hệ thôngs phân cấp ngoại lệ) riêng -> kê thừa từ **HttpException**

```ts
// forbidden.exception.ts
import { HttpException, HttpStatus } from "@nestjs/common";

export class ForbiddenException extends HttpException {
    constructor() {
        super('Forbidden', HttpStatus.FORBIDDEN);
    }
}
```

## Built-in HTTP exceptions (Các ngoại lệ tích HTTP tích hợp)

Cung cấp tập ngoại lệ tiêu chuẩn kế thừa từ **HttpException**

    *BadRequestException
    *UnauthorizedException
    *NotFoundException
    *ForbiddenException
    *NotAcceptableException
    *RequestTimeoutException
    *ConflictException
    *GoneException
    *HttpVersionNotSupportedException
    *PayloadTooLargeException
    *UnsupportedMediaTypeException
    *UnprocessableEntityException
    *InternalServerErrorException
    *NotImplementedException
    *ImATeapotException
    *MethodNotAllowedException
    *BadGatewayException
    *ServiceUnavailableException
    *GatewayTimeoutException

## Exception filters

Dùng để -> full controll exception -> thêm nhật ký,JSON scheman khác -> kiểm xoát chính xác nội dung + response send client 

```ts
import { Catch, HttpException, ExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Response, Request } from "express";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();

        response
            .status(status)
            .json({
                statusCode: status,
                timestamp: new Date().toISOString(),
                path: request.url
            })
    }
}
```

```
Tất cả exception filter cần -> ExceptionFilter<T> interface. -> catch(exceptionn: T, host: ArgumentsHost) với T cho biết loại exception. 
```

@Catch(HttpException) decorator -> bắt buộc với exception filter -> cho Nest biết exception filter đang tìm exception type **HttpException** và không có gì khác.
@Catch() decorator -> nhận 1 tham số only, danh sách phần tách bằng dấu (,) => thiêt lập filter cho môt số exception cùng một lúc.


## Argument host

Đọc thêm trang chủ -> tại hạ không biết nên hiểu thế nào (-.-) -> nếu có time tại hạ sẽ nghiên cứu sau -> cáo từ

## Binđing filters

HttpExceptionFilter -> CatsController's create method. (Tại hạ tríc từ trang chủ -> thật sự ko hiểu)

```ts
// cat.controller.ts
@Post()
@UseFilters(new HttpExceptionFilter())
```

Sử dụng @UseFilters() decorator. Tương tự @Catch() decorator

Exception fillters -> level: method-scoped, controller-scoped, global-scoped.



Every route handler
```ts
@UseFilters(new HttpExceptionFilter())
export class CatssController {}
```

Create global-scoped filter

```diff
-WARNING
The useGlobalFilters() method does not set up filters for gateways or hybrid applications.
```

Giải quyết việc không thể inject dependencies vì outside the context of any module => register a global-scoped filter **directly from any module**

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

## Catch everything

```ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
```

Trong ví dụ trên, bộ lọc sẽ bắt từng ngoại lệ được ném ra, bất kể kiểu (lớp) của nó. (Chưa kiểm nghiệm)

## Inheritance

Uỷ quyền xử lý exception cho base filter -> extend BaseExxceptionFilter và call **catch()** method.

```ts
import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    super.catch(exception, host);
  }
}
```

```diff
-WARNING
Bộ lọc phạm vi phương pháp và phạm vi bộ điều khiển mở rộng BaseExceptionFilterkhông nên được khởi tạo với new. Thay vào đó, hãy để khuôn khổ khởi tạo chúng tự động.
```


Golbal filters can extend the base filter -> 2 cách

Phương pháp đầu tiên -> Chèn **HttpServer** tham chiếu khi custom global filter:

```ts

```
