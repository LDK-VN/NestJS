# HTTP module 

Nest chưa package [Axios](https://github.com/axios/axios) tích hợp sẵn thông qua **HttpModule**

Để sử dụng **HttpService** -> import **HttpModule**

```ts
@Module({
  imports: [HttpModule],
  providers: [CatsService],
})
export class CatsModule {}
```


Tiếp theo inject **HttpService** trong constructor

```ts
@Injectable()
export class CatsService {
  constructor(private httpService: HttpService) {}

  findAll(): Observable<AxiosResponse<Cat[]>> {
    return this.httpService.get('http://localhost:3000/cats');
  }
}
```

## Configuration (Cấu hình)

Đọc thêm : https://github.com/axios/axios#request-config

Chuyển một object cho **register** như bên dưới

```ts
@Module({
  imports: [
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
  ],
  providers: [CatsService],
})
export class CatsModule {}
```

## Async configuration (Cấu hình không đồng bộ)

Sử dụng **registerAsync()** method


```ts
HttpModule.registerAsync({
  useFactory: () => ({
    timeout: 5000,
    maxRedirects: 5,
  }),
});
```

Có thể sử dụng **async** và **inject**

```ts
HttpModule.registerAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    timeout: configService.getString('HTTP_TIMEOUT'),
    maxRedirects: configService.getString('HTTP_MAX_REDIRECTS'),
  }),
  inject: [ConfigService],
});
```

Có thể cấu hình thay thế factory bằng class -> useClass

```ts
HttpModule.registerAsync({
  useClass: HttpConfigService,
});
```

Tạo **HttpConfigService** bên trong **HttpModule**. Implement **HttpModuleOptionsFactory** interface -> class **createHttpOptions() method

```ts
@Injectable()
class HttpConfigService implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    return {
      timeout: 5000,
      maxRedirects: 5,
    };
  }
}
```

Sử dụng lại provider hiện có -> useExisting

```ts
HttpModule.registerAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
});
```