# Authentication (Xác thực)

Sample project [here][here]

[here]: https://github.com/nestjs/nest/tree/master/sample/19-auth-jwt

## Authentication requirements (Yêu cầu xác thực)

Authentication -> username + password => JWT -> dạng token -> uỷ quyền request tiếp 

Cài đặt package cần thiết

```bash
$ npm install --save @nestjs/passport passport passport-local
$ npm install --save-dev @types/passport-local
```

## Implementing Passport strategies (Thực hiện các chiến lược hộ chiếu)


Bắt đầu với **AuthModule** và **AuthService**

```bash
$ nest g module auth
$ nest g service auth
```

Tiếp theo **UserModule** và **UserService**

```bash
$ nest g module users
$ nest g service users
```

Trong **UserService** -> tạo danh sách người dùng  -> hard-coded trong bộ nhớ -> thực thế đây là nới sử dụng lib TypeORM, Sequelize, Mongose,etc


```ts
// user/user.service.ts

import { Injectable } from '@nestjs/common';

export type User = any;

@Injectable()
export class UsersService {
  private readonly users: User[];

  constructor() {
    this.users = [
      {
        userId: 1,
        username: 'john',
        password: 'changeme',
      },
      {
        userId: 2,
        username: 'chris',
        password: 'secret',
      },
      {
        userId: 3,
        username: 'maria',
        password: 'guess',
      },
    ];
  }

  async findOne(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }
}
```

Xuất ra bên ngoài module này -> tức là các module khác có thể import nó để sử dụng

```ts
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
```

**AuthService** -> truy xuất user và xác minh password. -> tạo ra **validateUser()** method

```ts
import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
```

```diff
-WARNING
password nên lưu bằng lib bcrypt
```

Import **UsersModule** -> **AuthModule**
```ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  providers: [AuthService],
})
export class AuthModule {}
```



## Implementing Passport local (Triển khai hộc chiếu địa phương)


Tạo tệp **local.strategy.ts** trong **auth**

```ts
// auth/locla.strategy.ts
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
```

Cấu hình **AuthModule** -> sử dụng các tính năng của Passport

```ts
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';

@Module({
  imports: [UsersModule, PassportModule],
  providers: [AuthService, LocalStrategy],
})
export class AuthModule {}
```

## Built-in Passport Guards (Hộ chiếu tích hợp)

Có 2 trạng thái:

1. user/client chưa đăng nhập -> không được xác thực
2. user/clienet đã đăng nhập -> được xác thực

### Login route

Thay thế nội dung **app.controller.ts**

```ts
// app.controller.ts

import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AppController {
  @UseGuards(AuthGuard('local'))
  @Post('auth/login')
  async login(@Request() req) {
    return req.user;
  }
}
```

Tạo một class riêng

```ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
```

Update **/auth/login** route handle -> **LocalAuthGuard**

```ts
@UseGuards(LocalAuthGuard)
@Post('auth/login')
async login(@Request() req) {
  return req.user;
}
```

## JWT functionality (Chức năng JWT)

* Cho phép người dùng xác thực username/password -> return JWT -> call api
* Tạo API routes được bảo vệ -> JWT -> dạng token.

Cài đặt các gói supprot JWT

```bash
$ npm install --save @nestjs/jwt passport-jwt
$ npm install --save-dev @types/passport-jwt
```

Package **@nestjs/jwt** [here][nest-jwt] giúp thao tác với JWT

* route handler chỉ được call khi đã xác thực
* **req** chứa **user** property

Tạo JWT trong **AuthService** -> thêm **login()** method

```ts
// auth/auth.service.ts

import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
```

Import **JwtModule** -> **AuthModule**

Tạo **constancts.ts** trong **auth** folder

```ts
// auth/constance.ts
export const jwtConstants = {
  secret: 'secretKey',
};
```

Sử dụng điều này để share key giữa các bước đăng ký và xác minh JWT

Cập nhật **auth.module.ts** như sau

```ts
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

Chi tiết [here][jwt] và [here][configuration-options] tuỳ chọn cấu hình có sẵn

Cập nhật **/auth/login** -> return về JWT

```ts
import { Controller, Request, Post, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
```

## Implementing Passport JWT

Bảo vệ enpoint -> JWT hợp thệ theo request
Tạo file **jwwt.strategy.ts** trong **auth** folder 

```ts
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
```

* **jwtFromRequest**: cung cấp method mà JWT sẽ được trích xuất từ **request** -> sử dụng bearber token trong Authorization header của API request
* **ignoreExpiration**: **false** -> đảm bảo JWT chưa hết hạn cho module Passport. -> nếu hết hạn -> 4-2 Unauthorized response.
* **secretOrKey**: cung cấp secret để signing(đăng ký) token.

Thêm mới **JwtStrategy** -> privider trong **AuthModule**

```ts
// auth/auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

Cuối cùng -> xác định **JwtAuthGuard** class mở rộng **AuthGuard**:

```ts
// auth/jwt-auth.guard.ts
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
```

## Implement protected route and JWT strategy guards.


Cập nhật **app.controller.ts** như sau

```ts
// app.controller.ts
import { Controller, Get, Request, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { LocalAuthGuard } from './auth/local-auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('auth/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log('req',req);
    return req.user;
  }
}
```

## Default strategy (Chiến lước mặc định)

Khai báo strategy default -> không cần truyền tên trong **AuthGuard** function.

```ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { UsersModule } from '../users/users.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
    UsersModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

## Request-scoped strategies (Chiến lược phạm vi yêu cầu)

Thêm **ModuleRef** vào **local.strategy.ts** file

```ts
constructor(private moduleRef: ModuleRef) {
  super({
    passReqToCallback: true,
  });
}
```

Trong **validate()** method -> dùng **getByRequest()** method -> tạo context id dựa trên request object và chuyển cho **resolve()**

```ts
async validate(
  request: Request,
  username: string,
  password: string,
) {
  const contextId = ContextIdFactory.getByRequest(request);
  // "AuthService" is a request-scoped provider
  const authService = await this.moduleRef.resolve(AuthService, contextId);
  ...
}
```

**resolve()** method return -> request-scoped không đồng bộ

## Extending guards (Mở rộng bảo vệ)

Mở rộng logic xác thực hoặc xử lý lỗi mặc định  -> Mở rộng class tích hợp và override method trong một sub-class

```ts
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
```

## Customize Passport (Tuỳ chỉnh hộ chiếu)

Sử dụng **register()** method

```ts
PassportModule.registerregister({ session: true });
```

Có thể chuyển strategies của một options object trong một constructor để định cấu hình chúng.

```ts
constructor(private authService: AuthService) {
  super({
    usernameField: 'email',
    passwordField: 'password',
  });
}
```

##  Named strategies (Đặt tên cho các chiến lược)

Triển khai strategies -> tên được đặt băng các chuyển đối số thứ 2 **PassportStrategy** -> nêu không có tên default -> vd: 'jwt' cho jwt strategy

```ts
export class JwtStrategy extends PassportStrategy(Strategy, 'myjwt')
```

## GrapQL

Sử dụng AUthGuard với GraphQL, extends AuthGuard class được tích hợp sẵn và override getRequest() method

```ts
@Injectable()
export class GqlAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
```

Để sử dụng cấu trúc trên -> đảm bảo -> chuyển **req** obj request() như một phần giá trị context trong setup GraphQL module

```ts
GraphQLModule.forRoot({
  context: ({ req }) => ({ req }),
});
```

Để có được người dùng đước xác thực hiện tại trong graphql resolver -> **@CurrentUser()** decorator

```ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req.user;
  },
);
```

Để sử dụng decorator trong resolver -> đảm bảo include nó dưới dạng tham số truy vấn hay mutation

```ts
@Query(returns => User)
@UseGuards(GqlAuthGuard)
whoAmI(@CurrentUser() user: User) {
  return this.usersService.findById(user.id);
}
```


[nest-jwt]: https://github.com/nestjs/jwt
[jwt]: https://github.com/nestjs/jwt/blob/master/README.md
[configuration-options]: https://github.com/auth0/node-jsonwebtoken#usage
