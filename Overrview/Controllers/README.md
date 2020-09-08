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
+HINT
```
Create a controller using the CLI -> `+@nest g controller cats`
```
