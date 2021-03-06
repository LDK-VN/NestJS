# Harnessing the power of TypeScript & GrapQL (Khai thác sức mạnh TypeScript và GraphQL)

GrapQl là một ngôn ngữ truy vấn mạnh mẽ cho các API và một runtime để thực hiện các truy vấn đó với dữ liệu hiện có của bạn.

## Installation (Cài đặt)

```bash
$ npm i @nestjs/graphql graphql-tools graphql apollo-server-express
```

## Overrview

Có 2 cách xấy dựng ứng dụng GraphQL -> code first, schema first

**code first** -> decorator + TypeScript classes
**schema first** -> files GrapQl SDL

## Getting started with GraphQL & TypeScript 

Import **GraphQLModule** + cấu hình bằng **forRoot()** static method.

```ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({}),
  ],
})
export class AppModule {}
```

Tắt **playground** và **debug**

```ts
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';

@Module({
  imports: [
    GraphQLModule.forRoot({
      debug: false,
      playground: false,
    }),
  ],
})
export class AppModule {}
```

## GraphQL playground (Sân chơi GraphQL)

## Multiple endpoints (Nhiều điểm cuối)

Khả năng phục vụ nhiều điểm cuối cùng lúc -> Cho phép quyết định module nào được đưa vào điểm cuối nào

```ts
GraphQLModule.forRoot({
  include: [CatsModule],
}),
```

## Code first 

Thêm property **autoSchemaFile** vào options object:

```ts
GraphQLModule.forRoot({
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
}),
```

Tạo nhanh trong bộ nhớ

```ts
GraphQLModule.forRoot({
  autoSchemaFile: true,
}),
```

Sắp sếp thứ tự lược đồ theo từ điển -> **sortSchema** bằng true

```ts
GraphQLModule.forRoot({
  autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
  sortSchema: true,
})
```

## Schema first

Thêm property **typePaths** vào options object

```ts
GraphQLModule.forRoot({
  typePaths: ['./**/*.graphql'],
}),
```

Sử dụng property **dèinitions** -> tự động tạo các định nghĩa TypeScript từ AST

```ts
GraphQLModule.forRoot({
  typePaths: ['./**/*.graphql'],
  definitions: {
    path: join(process.cwd(), 'src/graphql.ts'),
  },
}),
```

Một cách khác

```ts
import { GraphQLDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

const definitionsFactory = new GraphQLDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql.ts'),
  outputAs: 'class',
});
```

Chạy tập lệnh

```bash
$ ts-node generate-typings
```

Bật chế độ xem cho tập lệnh -> **watch** bằng true

```ts
definitionsFactory.generate({
  typePaths: ['./src/**/*.graphql'],
  path: join(process.cwd(), 'src/graphql.ts'),
  outputAs: 'class',
  watch: true,
});
```

Tự động tạo trường bổ sung **__typename** cho mọi loại đối tượng -> enable **emitTypenameField** option

```ts
definitionsFactory.generate({
  // ...,
  emitTypenameField: true,
});
```

Tạo trình phân giải (queries, mutations, subscriptions) dưới dạng các filed không argument -> enable **skipResolverArgs** option

```ts
definitionsFactory.generate({
  // ...,
  skipResolverArgs: true,
});
```

## Accessing generated schema (Truy cập lược đồ đã tạo)

Sử dụng **GraphQLSchemaHost** class:

```ts
const { schema } = app.get(GraphQlSchemaHost);
```

```diff
!Chú ý
Bạn phải gọi GraphQLSchemaHost#schemagetter sau khi ứng dụng đã được khởi tạo (sau khi onModuleInithook được kích hoạt bởi app.listen()hoặc app.init()method).
```

## Async configuration (Cấu hình không đồng bộ)

Sử dụng **forRootAsync()** method


Một số kỹ thuật sử dụng factory

```ts
GraphQLModule.forRootAsync({
  useFactory: () => ({
    typePaths: ['./**/*.graphql'],
  }),
}),
```

Có thể sử dụng **async** và **inject**

```ts
GraphQLModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    typePaths: configService.getString('GRAPHQL_TYPE_PATHS'),
  }),
  inject: [ConfigService],
}),
```

Sử dụng class thay vì factory

```ts
GraphQLModule.forRootAsync({
  useClass: GqlConfigService,
}),
```

Tạo file **GqlConfigService** trong **GrapQLModule** và implement **GqlOptionsFactory** interface.

```ts
@Injectable()
class GqlConfigService implements GqlOptionsFactory {
  createGqlOptions(): GqlModuleOptions {
    return {
      typePaths: ['./**/*.graphql'],
    };
  }
}
```

Sử dụng lại nhà cung cấp hiện tại -> useExisting syntax

```ts
GraphQLModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
}),
```