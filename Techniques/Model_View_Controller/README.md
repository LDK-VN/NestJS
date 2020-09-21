# Model-View-Controller

Nest mặc định sử dụng lib **express** -> Áp dụng MVC


Tạo ứng dụng MVC -> cần template engine -> render ra HTML views

```bash
$ npm install --save hbs
```

Sử dụng [hbs](https://github.com/pillarjs/hbs#readme)

```ts
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');

  await app.listen(3000);
}
bootstrap();
```

Tạo thư mục **views** và **index.hbs** template bên trong nó -> in ra một **message** thông qua controlller.

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>App</title>
  </head>
  <body>
    {{ message }}
  </body>
</html>
```

Open **app.controller** file và thay thế **root()** method bằng mã sau.

```ts
import { Get, Controller, Render } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Render('index')
  root() {
    return { message: 'Hello world!' };
  }
}
```

## Dynamic template rendering (Hiển thị mẫu động)

Sử dụng **@Res()** decorator và cung cấp tên chế độ xem trong router handler thay vì trong **@Render()** decortor:

