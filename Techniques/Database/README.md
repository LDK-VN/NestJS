# Database

Nest là database agnostic -> tích hợp bất kỳ SQL, NoSQL database nào.

## TypeORM Integration

Cài đặt thư viện

```bash
$ npm install --save @nestjs/typeorm typeorm mysql
```

import **TypeOrmModule** vào root folder **AppModule**.

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

Một số thuộc tính cấu hình bổ sung

* **retryAttempts**: Số lần cố gắng kết nối với cơ sở dữ liệu
* **retryDelay**: Độ trễ giữa các lần kết nối lại (mili giây)(mặc định 3000)
* **autoLoadEntities**: Nếu `true`, entities tải tự động (default false);
* **kêpConnectionAlive**: Nếu `true`, kết nối sẽ không bị đóng khi tắt ứng dụng (default false)

## Repository pattern (Mẫu kho lưu trữ)

Tạo một thự thể **user.entity.ts**
```ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
}
```

Khai báo entity để sử dụng

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [User],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
```

Sử dụng **forFeature()** method -> xác định repository nào được đăng ký trong phạm vi hiện tại.

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

Đưa **UsersRepository** vào **UserService** -> @InjectRepository()

```ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
```

## Relations (Quan hệ)

* One-to-one: Mỗi hàng trong bảng chính có một và chỉ một hàng đucoj liên kết trong bảng ngoại -> @OneToOne() decorator
* One-to-many/Many-to-one: Mỗi hàng trong bẳng chính có một hoặc nhiều hàng liên quan trong bảng ngoại. -> @OneToMany(), @ManyToOne() decorator
* Many-to-many: Mọi hàng trong bảng chính có nhiều hàng liên quan trong bảng ngoại và mọi bản ghi trong bảng ngoại có nhiều hàng liên quan trong bảng chính -> @ManyToMany() decorator

Ví dụ xác định mỗi **User** có nhiều anh -> @OneToMany() decorator

```ts
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Photo } from '../photos/photo.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(type => Photo, photo => photo.user)
  photos: Photo[];
}
```

## Auto-load entities (Tự động tải các thực thể)

Để tự dộng tải các **entities** mà không cần khai báo vào mảng  ->  Sử dụng **autoLoadEntities: true** truyền vào trong **forRoot()**

```ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...
      autoLoadEntities: true,
    }),
  ],
})
export class AppModule {}
```

## Separating entity definition (Định nghĩa tác thực thể)

Sử dụng "entity schemas" -> xác định thực thể và cột trong tệp riêng biệt

```ts
import { EntitySchema } from 'typeorm';
import { User } from './user.entity';

export const UserSchema = new EntitySchema<User>({
  name: 'User',
  target: User,
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  relations: {
    photos: {
      type: 'one-to-many',
      target: 'Photo', // the name of the PhotoSchema
    },
  },
});
```

Sử dụng **EntitySchema** cho nơi nào cần **Entity**

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserSchema])],
  providers: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
```

## Transaction (giao dịch)

Tài liệu tham khảo: https://viblo.asia/p/tim-hieu-ve-transaction-trong-mysql-RnB5pnxGZPG

Sử dụng **QueryRunner** class -> cho phép toàn quyền kiểm xoát giao dịch

```
QueryRunner -> Sử dụng để truy vấn database
```

Đầu tiên -> đưa **Connection** obj vào class

```ts
@Injectable()
export class UsersService {
  constructor(private connection: Connection) {}
}
```

Tạo giao dịch


```ts
async createMany(users: User[]) {
  const queryRunner = this.connection.createQueryRunner();

  await queryRunner.connect();
  /**
   * startTransaction bắt đầu một giao dịch
   */
  await queryRunner.startTransaction(); 
  try {
    await queryRunner.manager.save(users[0]);
    await queryRunner.manager.save(users[1]);

 /**
  * commitTransaction: cam kết tất cả thay đổi được thực hiện 
  */
    await queryRunner.commitTransaction();
  } catch (err) {
    /**
     * rollbackTransaction: đưa tất cả thay đổi về trạng thái ban đầu 
     */
    await queryRunner.rollbackTransaction();
  } finally {
    // you need to release a queryRunner which was manually instantiated
    await queryRunner.release();
  }
}
```

Ngoài ra có thể dùng **transaction** method

```ts
async createMany(users: User[]) {
  await this.connection.transaction(async manager => {
    await manager.save(users[0]);
    await manager.save(users[1]);
  });
}
```

Đọc thêm : https://typeorm.io/#/transactions/creating-and-using-transactions

## Subscribers (Người đăng ký)

Lăng nghe các sự kiện cụ thể

```ts
import {
  Connection,
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { User } from './user.entity';

@EventSubscriber()
export class UserSubscriber implements EntitySubscriberInterface<User> {
  constructor(connection: Connection) {
    connection.subscribers.push(this);
  }

  listenTo() {
    return User;
  }

  beforeInsert(event: InsertEvent<User>) {
    console.log(`BEFORE USER INSERTED: `, event.entity);
  }
}
```


Thêm vào **providers** mảng:

```ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserSubscriber } from './user.subscriber';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService, UserSubscriber],
  controllers: [UsersController],
})
export class UsersModule {}
```

## Mirgration 


## Multiple database (Nhiều database)

Tạo multiple database connection ( kết nối nhiều cơ sở dữ liệu)

```ts
const defaultOptions = {
  type: 'postgres',
  port: 5432,
  username: 'user',
  password: 'password',
  database: 'db',
  synchronize: true,
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...defaultOptions,
      host: 'user_db_host',
      entities: [User],
    }),
    TypeOrmModule.forRoot({
      ...defaultOptions,
      name: 'albumsConnection',
      host: 'album_db_host',
      entities: [Album],
    }),
  ],
})
export class AppModule {}
```

Để cho @InjectRepository() decorator biết là kết nối nào nên được sử dụng

```ts
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([Album], 'albumsConnection'),
  ],
})
export class AppModule {}
```

Có thể đưa **Connection** or **EntityManager** cho một kết nối nhất định

```ts
@Injectable()
export class AlbumsService {
  constructor(
    @InjectConnection('albumsConnection')
    private connection: Connection,
    @InjectEntityManager('albumsConnection')
    private entityManager: EntityManager,
  ) {}
}
```

## Testing 

Tạo repository giả -> custom providers

* getRepositoryToken(): Trả về token dựa trên thực thể 
* mockRepository: nó sẽ làm **UserRepository**

Khi dùng **@InjectRepository()** -> sử dụng **mockRepository** đã đăng ký

```ts
@Module({
  providers: [
    UsersService,
    {
      provide: getRepositoryToken(User),
      useValue: mockRepository,
    },
  ],
})
export class UsersModule {}
```

## Custom repository (Tuỳ chỉnh kho lưu trữ)

Đọc thêm: https://typeorm.io/#/custom-repository

Tạo custom repository, sử dụng **@EntityRepository()*** decorator extend **Repository** class.

```ts
@EntityRepository(Author)
export class AuthorRepository extends Repository<Author> {}
```

Tiếp theo Nest sẽ khởi tạo bằng các truyền cho **TypeOrm.forFeature()**

```ts
@Module({
  imports: [TypeOrmModule.forFeature([AuthorRepository])],
  controller: [AuthorController],
  providers: [AuthorService],
})
export class AuthorModule {}
```

Tiếp theo đơn giản chỉ cần inject nó 

```ts
@Injectable()
export class AuthorService {
  constructor(private authorRepository: AuthorRepository) {}
}
```


## Async configuration (cấu hình không đồng bộ)

Sử dụng useFactory:

```ts
TypeOrmModule.forRootAsync({
  useFactory: () => ({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'test',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
});
```

Có thể **Async** và inject dependency 
```ts
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('HOST'),
    port: +configService.get<number>('PORT'),
    username: configService.get('USERNAME'),
    password: configService.get('PASSWORD'),
    database: configService.get('DATABASE'),
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  }),
  inject: [ConfigService],
});
```

Ngoài ra có thể dùng **useClass** syntax:

```ts
TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
});
```

Gọi **createTypeOrmOptions()** để tạo config

```ts
@Injectable()
class TypeOrmConfigService implements TypeOrmOptionsFactory {
  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true,
    };
  }
}
```

Ngăn tạo config trong **TypeOrmModule** và import module khác -> **useExisting** method

```ts
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useExisting: ConfigService,
});
```