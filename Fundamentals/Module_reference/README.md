# Module_reference

**ModuleRef** class -> danh sách nội bộ  các nhà cung cấp và tham chiếu đến bất kỳ provider nào bằng cách sử dụng injection token (mã thông báo tiêm) của nó 
làm khoa tra cứu 

```ts
@Injectable()
export class CatsService {
  constructor(private moduleRef: ModuleRef) {}
}
```

## Retrieving instance (truy xuất phiên bản)

**ModuleRef()** -> có method 'get()' -> truy xuất -> privider, controllers, injectable (guard, intercreptor ,etc) tồn tại trong module hiện tại bằng cách sử dụng tên class / injection token.

```ts
@Injectable()
export class CatsService implements OnModuleInit {
  private service: Service;
  constructor(private moduleRef: ModuleRef) {}

  onModuleInit() {
    this.service = this.moduleRef.get(Service);
  }
}
```

Để truy xuất provider global ngữ cảnh -> {strict: false} -> đối số thứ 2 cho 'get()'

```ts
this.moduleRef.get(Service, {strict: false});
```

## Resolving scoped providers (Giải quyết các provider có phạm vi)

Sử dụng **resolve()** method -> đối số -> injection token 

```ts
@Injectable()
export class CatsService implements OnModuleInit {
  private transientService: TransientService;
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.transientService = await this.moduleRef.resolve(TransientService);
  }
}
```

Gọi **resolve()** nhiều hơn một lần -> nó sẽ không bằng nhau

```ts
@Injectable()
export class CatsService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    const transientServices = await Promise.all([
      this.moduleRef.resolve(TransientService),
      this.moduleRef.resolve(TransientService),
    ]);
    console.log(transientServices[0] === transientServices[1]); // false
  }
}
```

Đam bảo chúng chía sẽ sub-tree -> chuyển một context code  -> **ContextIdFactory** class để tạo một định danh context. 

```ts
@Injectable()
export class CatsService implements OnModuleInit {
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    const contextId = ContextIdFactory.create();
    const transientServices = await Promise.all([
      this.moduleRef.resolve(TransientService, contextId),
      this.moduleRef.resolve(TransientService, contextId),
    ]);
    console.log(transientServices[0] === transientServices[1]); // true
  }
}
```

## Getting current sub-tree 

Giải quyết phiên bản của một provider theo phạm vi **request context**

```ts
@Injectable()
export class CatsService {
  constructor(
    @Inject(REQUEST) private request: Record<string, unknown>,
  ) {}
}
```

sử dụng **getByRequest()** method **ContextIdFactory** -> tạo id context -> chuyển vào 'resolve()'

```ts
const contextId = ContextIdFactory.getByRequest(this.request);
const catsRepository = await this.moduleRef.resolve(CatsRepository, contextId);
```

## Instantiating custom classes dynamically (Khởi tạo động các class tuỳ chỉnh)

Khởi tạo class chưa được đăng ký trước đó làm providers -> 'create()' method

```ts
@Injectable()
export class CatsService implements OnModuleInit {
  private catsFactory: CatsFactory;
  constructor(private moduleRef: ModuleRef) {}

  async onModuleInit() {
    this.catsFactory = await this.moduleRef.create(CatsFactory);
  }
}
```