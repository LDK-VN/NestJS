# NestJS
   
   ![NestJS](https://github.com/LDK-VN/NestJS/blob/master/Resource/logo.png)

## Tài liệu tham khảo
* https://docs.nestjs.com/
* https://www.merixstudio.com/blog/nestjs-how-and-why-use-it/

## NestJS
### NestJS là gì?
* Là framework để xấy dựng các ứng dụng server-side bằng **nodeJS** hiệu quả và rễ mở rộng.
* Sử dụng Typescript(default), có thể sử dụng cả Pure Javascript.
* OOP, FR(Functional Programming), FRP(Functional Reactive Programming).
* Sử dụng HTTP servers framework
* Express (default)
* Fastify

### Tại sao nên sử dụng?
* Giải quyết được vấn đề về structuring
* Kiến trúc out-of-the-box -> Mở rộng, dễ maintain, … -> Lấy từ Angular

### NestJS có những gì?
* Design pattern -> Dependency Injection
* Cú pháp giống **Angular**
* Nhiều module support như hot reload, logger, GraphQL, Websocket, cqrs pattern, microservices,…

### Installation
Xấy dựng bằng [Nest CLI][nest-cli] hoặc clone một dự án khởi đầu

* Nest-CLI
```
$npm i -g @nestjs/cli
$nest new project-name
```

* Typescript starter project with **Git**:
```
$ git clone clone https://github.com/nestjs/typescript-starter.git project
$ cd project
$ npm install
$ npm run start
```

* Javascript starter project with **Git**:
```
$ git clone clone https://github.com/nestjs/javascript-starter.git project
$ cd project
$ npm install
$ npm run start
```

Tạo dự án mới từ đầu, tự tạo các project boilerplate files (Tệp file mẫu).
```
$ npm i --save @nestjs/core @nestjs/common rxjs reflect-metadata
```

[nest-cli]: https://docs.nestjs.com/cli/overview
