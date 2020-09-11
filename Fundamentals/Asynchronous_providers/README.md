# Asynchronous providers (Nhà cung cấp không đồng bộ)

Sử dụng **async/await** với **useFactory** syntax -> return -> **Promise**, và factory function có thể **await** tác vụ không đồng bộ.
Nest chờ promise -> sau đó mới khởi tạo bất kỳ class phụ thuộc đưa vào nhà cung cấp đó.

```ts
{
  provide: 'ASYNC_CONNECTION',
  useFactory: async () => {
    const connection = await createConnection(options);
    return connection;
  },
}
```

## Injection

Asynchronous providers được tiêm cho các thành phần khác bằng tokes (mã thông báo) -> @Inject('ASYNC_CONNECTION')