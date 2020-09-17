# Validation

Nest cung cấp vài pipes có sãn

* ValidationPipe
* ParseIntPipe
* ParseBoolPipe
* ParseArrayPipe
* ParseUUIDPipe

## Using the built-in ValidationPipe (Sử dụng ValidationPipe)

Sử dụng **class-validator** và **class-transform** lib

chi tiết: https://docs.nestjs.com/techniques/validation#using-the-built-in-validationpipe

```ts
export interface ValidationPipeOptions extends ValidationOptions {
    transform?: boolean;
    disableErrorMessage?: boolean;
    exceptionFactory?: (errors: ValidationError[]) => any;
}
```

## Auto-validation (Tự động xác thực)

Ràng buộc **ValidationPipe** level app -> endpoind được bảo vệ bởi dữ liệu không chính xác

```ts
async function bootstrap() {
  const app = await NestFactory.create(ApplicationModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

Kiểm tra pipe

```ts
@Post()
create(@Body() createUserDto: CreateUserDto) {
  return 'This action adds a new user';
}
```

Request -> **email** property invalid => error 404 Bad Request

```ts
{
  "statusCode": 400,
  "error": "Bad Request",
  "message": ["email must be an email"]  
}
```

Chỉ các số được chấp nhận trong `:id`

```ts
@Get(':id')
findOne(@Param() params: FindOneParams) {
  return 'This action returns a user';
}
```

## Disable detailed errors (Tắt các lỗi chi tiết)

```ts
app.useGlobalPipes(
  new ValidationPipe({
    disableErrorMessages: true,
  }),
);
```

## Stripping properties (Tước các thuộc tính)

Lọc ra các thuộc tính không được xử lý bởi method -> tức là lọc ra property có decorator -> còn lại nó sẽ bị xoá khỏi kết quả DTO

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
  }),
);
```

Nếu muốn show ra lỗi với những property không có trong white list -> sử dụng **forbidNonWhitelisted: true**

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }),
);
```

## Transform payload objects (Chuyển đổi đối tượng tải trọng)

Chuyển đổi payload -> object -> DTO classes

```ts
@Post()
@UsePipes(new ValidationPipe({ transform: true }))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

Kích hoạt toàn cầu

```ts
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
  }),
);
```

Chuyển đổi các kiểu nguyên thuỷ

```ts
 @Get(':id')
findOne(@Param('id') id: number) {
  console.log(typeof id === 'number'); // true
  return 'This action returns a user';
}
```

Trong trường hợp này nó sẽ cố gẵng chuyển đổi mộit định danh chuỗi thành số

## Explicit conversion (Chuyển đổi rõ ràng)

Sử dụng **ParseIntPipe** or **ParseBollPipe** để chuyển giá trị khi tính năng auto-transformation tắt (**ParseStringPipe** default là không cần thiết vì mọi tham số đường dẫn di qua mạng mặc định đều là kiểu **string** )

```ts
@Get(':id')
findOne(
  @Param('id', ParseIntPipe) id: number,
  @Query('sort', ParseBoolPipe) sort: boolean,
) {
  console.log(typeof id === 'number'); // true
  console.log(typeof sort === 'boolean'); // true
  return 'This action returns a user';
}
```

## Parrsing and validating arrays (Phân tích cú pháp và xác thực mảng)

TypeScript không lưu trữ metadata về generics và interfaces -> Dùng trong DTO -> **ValidationPipe** có thể xác thực không đúng.

```ts
@Post()
createBulk(
  @Body(new ParseArrayPipe({ items: CreateUserDto }))
  createUserDtos: CreateUserDto[],
) {
  return 'This action adds new users';
}
```

Sử dụng **ParseArrayPipe** để xác thực mảng.

```ts
@Post()
createBulk(
  @Body(new ParseArrayPipe({ items: CreateUserDto }))
  createUserDtos: CreateUserDto[],
) {
  return 'This action adds new users';
}
```

Ngoài ra nó còn hữu ích khi phân tích syntax tham số truy vấn

```ts
@Get()
findByIds(
  @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
  ids: number[],
) {
  return 'This action returns users by ids';
}
```

Nó sẽ xác thực cấu trúc tham số từ request **GET** như sau:

```ts
GET /?ids=1,2,3
```

## WebSockets and Microservices

**ValidationPipe** hoạt động giống nhau đối với WebSockets và microservices, bất kể method transports được sử dụng.

## Learn more

Tìm hiểu thêm về [class-validator](https://github.com/typestack/class-validator)