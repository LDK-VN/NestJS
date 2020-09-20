# Security 

Kỹ thuật tăng tính bảo mật cho ứng dụng.

## Helmet (Mũ bảo hiểm)

Bảo vệ ứng dụng khỏi một số lỗ hổng bảo mật nỗi tiếng ([Đọc thêm](https://github.com/helmetjs/helmet#how-it-works))

Cài đặt

```bash
$ npm i --save helmet
```

Áp dụng như một global middleware

```ts
import * as helmet from 'helmet';
// somewhere in your initialization file
app.use(helmet());
```

## CORS

Cross-origin resource sharing (chia sẽ tài nguyên nguồn gốc chéo) (CORS) -> cơ chế cho phép tài nguyên được yêu cầu từ một domain khác.

Gọi **enableCors()** dể bật CORS.

```ts
const app = await NestFactory.create(AppModule);
app.enableCors();
await app.listen(3000);
```

Một cách khác thông qua **create()** method.

```ts
const app = await NestFactory.create(AppModule, { cors: true });
await app.listen(3000);
```

## CSRF
Giả mạo yêu cầu trên trang web (CSRF hay XSRF) -> thực hiện các lệnh trái phép từ client mà ứng dụng web tin cậy

```bash
$ npm i --save csurf
```

```diff
-CẢNH BÁO
Như đã giải thích trên csurf middleware page(https://github.com/expressjs/csurf#csurf) , mô-đun csurf yêu cầu phần mềm trung gian phiên hoặc trình phân tích cú pháp cookie được khởi tạo trước
```

Sử dụng global:

```ts
import * as csurf from 'csurf';
// somewhere in your initialization file
app.use(csurf());
```

## Rate limiting (Giới hạn tỷ lệ)

Kỹ thuật bảo vệ khỏi tấn công brute-force

Cài đặt:

```bash
$ npm i --save express-rate-limit
```

Áp dụng global

```ts
import * as rateLimit from 'express-rate-limit';
// somewhere in your initialization file
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  }),
);
```

```ts
const app = await NestFactory.create<NestExpressApplication>(AppModule);
// see https://expressjs.com/en/guide/behind-proxies.html
app.set('trust proxy', 1);
```
