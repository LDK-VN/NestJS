# Pipe

Anonotated (Chú thích) **@Injection()** decorator -> implement **PipeTransform** interface.

<p align="center">
  <a href="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/pipe.png" target="blank"><img src="https://github.com/LDK-VN/NestJS/blob/master/Resource/image/pipe.png" width="860" alt="pipe" /></a>
</p>

Pipes have two typical use cases (2 trường hợp sử dụng điển hình):

* **transformation**: chuyển đổi dữ liệu đầu vào sang dạng mong muốn (e.g., from string to integer) 
* **validation**: evaludatue (đánh giá) input data and if valid (hợp lệ) -> pass and if don't valid -> throw an exception

In both cases (trong cả 2 trường hợp) -> operate (Vận hành, hoạt động) trên cơ sở **arguments** đang được processed(xử lý) bởi [controller route handler][controller-route-handler]
Nest interposes (đan xen, lồng) a pipe -> trước lúc call method -> nhận arguments cho method và làm t với chúng (làm thân). -> method được gọi với bất kỳ arguments (có thể) được chuyển đổi.

Nest comes (đi kèm) -> một số pipes lắp sẵn -> use out-of-the-box (hiểu chết liền). Tuy nhiên có thể custom.

```diff
!HINT
Pipes run inside the exception zone (vùng ngoại lệ) => Pipe throws an exception -> not call controller method => Help xác thực data tới từ các nguồ bên ngoài system boundary (ranh giới hệ thống).
```

## Built-in pipes

Nest comes 6 pipe avalilable(có sẵn) out-of-the-box:

* ValidationPipe
* ParseIntPipe
* ParseBoolPipe
* ParseArrayPipe
* ParseUUIDPipe
* DefaultValuePipe

## Binding pipes

To use a pipe -> bind an instance của pipe với ngữ cảnh thích hợp (Hiểu ko?)(-.-).

Binding the pipe at the method parameter level (Ràng buộc dữ liệu ở cấp phương thức)

```ts
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

Đảm bảo 1 trong 2 điều kiện sau là đúng: 
  * Tham số nhận trong **findOne()** là số
  * An exceptionn is throw before the route handler is called.

For example, assume (giả sử) the route is called like:

```
GET localhost:3000/abc
```

Thrown an exception -> Prevent the body **findOne()**
```JSON
{
  "statusCode": 400,
  "message": "Validation failed (numeric string is expected)",
  "error": "Bad Request"
}
```
Customize hành vi pipe -> passing options (chuyển các tuỳ chọn):

```ts
@Get(':id')
async findOne(@Param('id',new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE})) id: number) {
  return this.catsService.findOne(id);
}
```

Ví dụ sử dụng **ParseUUIDPipe** -> validate UUID hay không

```ts
@Get(':uuid')
    async findOne(@Param('uuid', new ParseUUIDPipe) uuid: string) {
        return `This actionn returns a #${uuid} cat`;
    }
```

```diff
!HINT
Xem thêm [Vlaidation techniques][validation-techniques] -> validate pipes.
```

## Custom pipes 

Bắt đầu với **ValidationPipe**. Lấy giá trị đầu vào -> return về cung 1 giá trị -> behaving (hành động, cư xử) như một indentity function (hàm nhận dạng).

```ts
import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
} 
```

```diff
PipeTransform<T, R> là interface -> pipe phải implemented
T -> loại đầu vào 'value'
R -> kiểu trả về transform() method
```

Every pipe must(phải) implement the **transform()** method -> fullfill(hoàn thành) **PipeTransform** interface contract (Hợp đồng giao diện). Have two parameters:

* value : parameter của argument method hiện đang xử lý.
* metadata: argument's metadata hiện đang xử lý.

```ts
export interface ArgumentMetadata {
  type: 'body' | 'query' | 'param' | 'custom';
  metatype>: Type<unknown>
  data?: string;
}
```

properties describe  the currently processed arrgument (đối số hiện đang xử lý).

* type      -> cho biết argument là body **@Body**, query **@Query**, param **@Param()**, or custom parameter (tham số tuỳ chỉnh) (read more [here][type]) 

* Provides  -> the metatype of the argument, for example, String. Note: the value is undefined if you either omit a type declaration in the route handler method signature, or use vanilla JavaScript. (Không hiểu, không hiểu, không hiểu (-.-))

* data      -> Ex: @Body('string'), @Body() is undefined

```diff
!HINT
Interface TypeScript -> JS => mất
=> metatype value -> Object
```

## Schema based validation (Xác thực dựa trên lược đồ)

```ts
@Post()
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

```ts
// create-cat.dto.ts
export class CreateCatDto {
  name: string;
  age: number;
  breed: string;
}
```

Cần validate three members of the **createDto** object. 

1 -> Handle inside **router handler** method -> break -> **signle responsibility rule(SRP)**
2 -> Create a **validator class** -> disadvantage (Bất lợi, nhược điểm) -> remember call begining of each method (bắt đầu mỗi method)
3 -> Using middleware -> BUT -> không thể sử dụng trên tất cả context của ứng dụng -> vì không biết về **execution context** (Ngữ cảnh thực thi)

=> Sử dụng pipe là hợp lý rồi (+.+).

## Object schema validation (Xác thực lược đồ đối tượng)

Có một số cách validation clean, DRY. Một trong mấy đứa là -> **schema-based**

Joi -> allows(cho phép) tạo schemas đơn giản, với 1 API có thể đọc được.Build validation pipe dựa trên Joi.


Start by install package:

```bash
$ npm install --save @hapi/joi
$ npm install --save-dev @types/hapi__joi
```

Ở đây schema làm **argument** của **constructor** -> sau đó apply **schema.validate()** method


```ts
import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from '@hapi/joi';
@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}
  
  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if(error) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
```

## Binding validation pipes (Đường ống ràng buộc xác thực)

Sử dụng **JoiValidationPipe**:
  1. Create an intance (thể hiện, phiên bản) của **JoiValidationPipe**
  2. Pass the context-specific (ngữ cảnh cụ thể) Joi schema in the class constructor of the pipe.
  3. Bind the pipe to the method (Ràng buộc pipe với method).

```ts
@Post()
@UsePipes(new JoiValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

## Class validator

```diff
-WARNING
Techniques(kỹ thuật) this section require TypeScript, not available(không khả dụng) if your app is written using vanilla JavaScript.
```

Nest hoạt động tốt [class-validator][class-validator]. Allows use decorator-based validation(cho phép sử dụng xác thực dựa trên trình xác thực trang trí max max mạnh -> đại loại là găn thêm tag @ trên lưng. Mạnh hơn khi kết hợp với Nest't **Pipe** -> vì chúng tôi có quyền truy cập vào **metadata** thuộc tính đã xử lý).

Fist bờ lớt -> install 2 thằng này

```bash
$ npm i --save class-validator class-transformer
```

Sau đó -> add a few(vài) decorators vào **CreateCatDto** class => Advantage -> **CreateCatDto** class remains the single source of truth for our Post body object (Thay vì phải tạo lớp xác nhận riêng).


```diff
!HINT
Read more about the class-validator decorators [here][class-validator]
```

Tạo class **ValidationPipe**

```ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
```

```diff
+NOTE
class-validator với class-transformer làm việc tốt với nhau
```

async transform -> Nest support **asynchronous** và **synchronous** -> Và vì class-validator validations có thể **can be async** (sử dụng Promises)

Using destructuring to extract(xuất) metatype filed (an **ArgumentMetadata**)

**toValidate()** -> bypassing (bỏ qua) xác thực khi argument -> processed(Xử lý) native JS type (Because chúng không có decorator)

**plainToClass()** -> chuyển JS argument object (Đối tượng đối số JS) -> thành typed object có thể apply validation (chi tiết đọc thêm trong docs nest)

```ts
// cat.controller.ts

@Post()
async create (
  @Body(new ValidationPipe()) createCatDto: CreateCatDto
) {
  this.catsService.create(createCatDto);
}
```

## Global scoped pipes (Đường ống phạm vi toàn cầu)

Áp dụng pipe trên toàn bộ ứng dụng

```ts
async function bootstrap() {
  const app = await NesstFactory.create(AppModule);
  app.
}
```

Thiết lập pipe chung cho all module

```ts
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {}
```

```diff
+NOTE
In the case of hybrid apps the useGlobalPipes() method doesn't set up pipes for gateways and micro services. For "standard" (non-hybrid) microservice apps, useGlobalPipes() does mount pipes globally. (Hiểu ko)(-.-)
```

## Transformation use case (Trường hợp sử dụng chuyển đổi)

Using pipe -> **transform** input data -> desired format (định dạng mong muốn) -> return value -> ghi đè argument trước đó

Case -> Ex:chuyển đổi số nguyên thành chuỗi, đặt giá tị mặc định khi thiếu argument.

```ts
// parse-int.pipe.ts

import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```

Liên kết pipe với tham số đã chọn

```ts
@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return this.catsService.findOne(id);
}
```

Trường hợp hữ ích khác

```ts
@Get(':id')
findOne(@Param('id', UserByIdPipe) userEntity: UserEntity) {
  return userEntity;
}
```

=> DRY bằng cách trừu tượng hoá mã soạn sẵn ra khỏi handler và common pipe

## Providing defaults (Cung cấp giá trị mặc định)

Cần default value được đưa vào trước khi ** Parse* ** hoạt động -> **DefaultValuePipe** -> Trong **@Query()** decorator trước ** Parse* ** pipe liên quan:

```ts
@Get()
async findAll(
  @Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean,
  @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
) {
  return this.catsService.findAll({ activeOnly, page })
}
```

## THe built-in ValidationPipe (ValidationPipe được tích hợp sẵn)

Không cần build **ValidationPipe** vì nó có sẵn. About more [here][validation-pipe]





[controller-route-handler]: https://docs.nestjs.com/controllers#route-parameters
[validation-techniques]: https://docs.nestjs.com/techniques/validation
[type]: https://docs.nestjs.com/custom-decorators
[class-validator]: https://github.com/typestack/class-validator
[validation-pipe]: https://docs.nestjs.com/techniques/validation