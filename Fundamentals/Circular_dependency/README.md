# Circular dependency (Phụ thuộc tròn)

A cần B -> B cần C -> C cần A => chính là circular dependency

## Forward reference (Chuyển tiếp tham chiếu)

Sử dụng **forwardRef()** -> trong **@Inject()** -> Nếu không Nest sẽ không khởi tạo -> vì metadata cần thiết sẽ không khả dụng

**CatsService**

```ts
@Injectable()
export class CatsService {
  constructor(
    @Inject(forwardRef(() => CommonService))
    private commonService: CommonService,
) {}
}
```

**CommonService**
```ts
@Injectable()
export class CommonService {
  constructor(
    @Inject(forwardRef(() => CatsService))
    private catsService: CatsService,
  ) {}
}
```

## Module forward reference

Giải pháp thay thế sử **ModuleRef** class để truy xuất trình cung cấp ở 1 phía mối qua hệ vòng tròn.


## Module forward refence

Giải quyết vòng tròn phụ thuộc -> **forwardRef()** trên cả 2 phía liên kết modules

```ts
@Module({
  imports: [forwardRef(() => CatsModule)],
})
export class CommonModule {}
```
