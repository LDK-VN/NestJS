# Serialization

Nó xảy ra trước khi các đối tượng được trả về trong một network response

## Exclude properties (Loại trừ các thuộc tính)

Ví dụ loại **password** property khỏi user entity

```ts
import { Exclude } from 'class-transformer';

export class UserEntity {
  id: number;
  firstName: string;
  lastName: string;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
```

Ví dụ controller với một method handler trả về instance của class này

```ts
@UseInterceptors(ClassSerializerInterceptor)
@Get()
findOne(): UserEntity {
   return new UserEntiry({
        id: 1,
        firstName: 'Khanh',
        lastName: "Le Duy",
        password: 'password',
    });
}
```

Kết quả:

```JSON
{
    "id": 1,
    "firstName": "Khanh",
    "lastName": "Le Duy"
}
```

```diff
-CẢNH BÁO
Lưu ý rằng chúng ta phải trả về một instance của class. Ví dụ: nếu bạn trả về một đối tượng JavaScript thuần túy { user: new UserEntity() }, đối tượng sẽ không được tuần tự hóa đúng cách.
```

## Expose properties (Hiển thị các thuộc tính)

**@Expose()** decorator cung cấp tên bí danh cho các thuộc tính hoăcj function để tính toán giá trị property(tương tự như **getter** function).

```ts
@Expose()
get fullName(): string {
  return `${this.firstName} ${this.lastName}`;
}
```

Kết quả:

```JSON
{
    "id": 1,
    "firstName": "Khanh",
    "lastName": "Le Duy",
    "fullName": "Khanh Le Duy"
}
```

## Transform (Chuyển đổi)

Sử dụng **@Transform()**  -> Chuyển đổi dữ liệu bổ sung

```ts
@Transform(role => role.name)
role: RoleEntity;
```

## Pass options (Vượt qua các tuỳ chọn)

Sử đổi hành vi mặc định của các hàm chuyển đổi. Ghi đè cài đặt default -> chuyển chúng vào trong **options** object bằng **@SerializaOptions()** decorator.

Ví dụ này loại bỏ tất cả property bắt đầu bằng dấu '_'.

```ts
@SerializeOptions({
  excludePrefixes: ['_'],
})
@Get()
findOne(): UserEntity {
  return new UserEntity(
    id: 1,
    firstName: 'Khanh',
    _lastName: "Le Duy",
    password: 'password',
    role: new RoleEntity({
    name:'khanhd',
    role:'admin'
    })
  );
}
```

Kết quả:

```JSON
{
    "id": 1,
    "firstName": "Khanh",
    "role": "khanhd",
    "fullName": "Khanh Le Duy"
}
```


