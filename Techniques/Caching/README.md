# Caching

Kỹ thuật đơn giản, cải thiện hiệu suất. Nó như kho lưu trữ tạm thời cung cấp khả năng truy cập dữ liệu hiệu suất cao.

## Installition

```bash
$ npm install --save cache-manager
```

## In-memory cache (Bộ nhớ đệm trong bộ nhớ)

Import **CacheModule** và gọi **register()** method của nó.

```ts
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController],
})
export class ApplicationModule {}
```

```diff
-CẢNH BÁO
Trong các ứng dụng GraphQL , các bộ chặn được thực thi riêng biệt cho từng trình phân giải trường. Do đó, CacheModule(sử dụng bộ chặn để phản hồi bộ nhớ cache) sẽ không hoạt động bình thường.
```

Sau đó chỉ cần nối **CacheInterceptor** nơi muốn lưu dữ liệu vào bộ nhớ cache.

```ts
@Controller()
@UseInterceptors(CacheInterceptor)
export class AppController {
  @Get()
  findAll(): string[] {
    return [];
  }
}
```

```diff
-CẢNH BÁO
Chỉ các GET điểm cuối mới được lưu vào bộ nhớ đệm. Ngoài ra, các tuyến máy chủ HTTP đưa đối tượng phản hồi gốc ( @Res()) không thể sử dụng Bộ đánh chặn bộ nhớ cache. Xem bản đồ phản hồi để biết thêm chi tiết.
```

## Global cache (Bộ nhớ cache chung)

Liên kết **CacheInterceptor** với tất cả điểm cuối trên toàn cầu:

```ts
import { CacheModule, Module, CacheInterceptor } from '@nestjs/common';
import { AppController } from './app.controller';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [CacheModule.register()],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class ApplicationModule {}
```

## Customize caching (Tuỳ chỉnh bộ nhớ đệm)

Tuỳ chỉnh thời gian hết hạn riêng (TTL) dữ liệu lưu trong bộ nhớ cache.

```ts
CacheModule.register({
  ttl: 5, // seconds
  max: 10, // maximum number of items in cache
});
```

## Global cache overrides (Bộ nhớ cache ghi đè toàn cầu)

Có thể ghi đè cài đặt bộ nhớ đệm nhất định (@CacheKey() và @CacheTTL() trên cơ sở từng method, cho phép tuỳ chỉnh strategies cho các controller method riêng lẻ) => Phù hợp khi sử dụng ** các kho lư trữ bộ nhớ cache khác nhau".

```ts
@Controller() 
export class AppController() {
  @CacheKey('custom_key')
  @CacheTTL(20)
  findAll(): string[] {
    return [];
  }
}
```

Với các cài đặt không bị override -> lấy giá trị mặc định

## WebSocket and Microservices

Có thể áp dụng **CacheInterceptor** cho WebSocket subscribers cũng như Microservice's patterns (bất kể method transport đang được dùng). Không nên lưu mọi thứ vào bộ nhớ cache

```ts
@CacheKey('events') // Yêu cầu khóa -> lưu, truy xuất dữ liệu đã lưu trong bộ nhớ cache sau đó.
@UseInterceptors(CacheInterceptor)
@SubscribeMessage('events')
handleEvent(client: Client, data: string[]): Observable<string[]> {
  return [];
}
```

Chỉ định thời gian hết bộ nhớ cache(TTL) 

```ts
@CacheTTL(10)
@UseInterceptors(CacheInterceptor)
@SubscribeMessage('events')
handleEvent(client: Client, data: string[]): Observable<string[]> {
  return [];
}
```

## Different stores (Cửa hàng khác nhau)

* Tận dụng [cache-manager](https://github.com/BryanDonovan/node-cache-manager)
**cache-manager** package support nhiều stores hữ ích, ví dụ [Redis](https://github.com/dabroek/node-cache-manager-redis-store). Danh sách stores support [here](https://github.com/BryanDonovan/node-cache-manager#store-engines)

```ts
import * as redisStore from 'cache-manager-redis-store';
import { CacheModule, Module } from '@nestjs/common';
import { AppController } from './app.controller';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
    }),
  ],
  controllers: [AppController],
})
export class ApplicationModule {}
```

## Adjust tracking (Cửa hàng khác nhau)

Tạo sub-class **ChacheInterceptor** và override **trackBy()** method.

```ts
@Injectable()
class HttpCacheInterceptor extends CacheInterceptor {
  trackBy(context: ExecutionContext): string | undefined {
    return 'key';
  }
}
```

## Async configuration (Cấu hình không đồng bộ)

Sử dụng **registerAsync**

```ts
CacheModule.registerAsync({
  useFactory: () => ({
    ttl: 5,
  }),
});
```

Tương tự asynchronous module factories (các nhà máy bất đồng bộ khác) (Có thể được **async** và có thể đưa vào các dependency thông qua **inject**)

```ts
CacheModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    ttl: configService.getString('CACHE_TTL'),
  }),
  inject: [ConfigService],
});
```

Ngoài ra có thể dùng **useClass** method:

```ts
CacheModule.registerAsync({
  useClass: CacheConfigService,
});
```

Implement **CacheOptionsFactory** interface để cung cấp các tuỳ chọn cấu hình:

```ts
@Injectable()
class CacheConfigService implements CacheOptionsFactory {
  createCacheOptions(): CacheModuleOptions {
    return {
      ttl: 5,
    };
  }
}
```

Dùng **useExisting** method để có thể dùng provider hiện có từ một module khác

```ts
CacheModule.registerAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
});
```

Hoạt động của nó như **useClass**. Tuy nhiên **CacheModule** nó sẽ tìm các module đã import để sử dụng lại bất kỳ module nào đã được tạo thay vì khởi tạo module chính nó.
