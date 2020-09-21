# Queues (Hàng đợi)

Là một design pattern -> quy mô và hiệu suât ứng dụng

## Installation (Cài đặt)

```bash
$ npm install --save @nestjs/bull bull
$ npm install --save-dev @types/bull
```

Import **BuildModule** vào **AppModule**.

```ts
// app.module.ts

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'audio',
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
  ],
})
export class AppModule {}
```

## Producers (Nhà sản xuất)

Thêm  công việc vào hàng đợi

```ts
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';

@Injectable()
export class AudioService {
  constructor(@InjectQueue('audio') private audioQueue: Queue) {}
}
```

Thêm một công việc bằng cách gọi **add()** method của hàng đợi, truyền một job object do người dùng xác định.

```ts
const job = await htis.audioQueue.add({
    foo: 'bar',
})
```

## Named jobs (Công việc đã đặt tên)

Cho phép tạo consumer chuyên biệt chỉ xử lý công việc với một cái tên nhất định.

```ts
const job = await this.audioQueue.add('transcode', {
  foo: 'bar',
});
```

## Job options (Tuỳ chọn công việc)

Truyền đối tượng job vao trong **Queue.add()** method

Ví dụ trì hoãn bắt đầu công việc -> **delay**

```ts
const job = await this.audioQueue.add(
  {
    foo: 'bar',
  },
  { delay: 3000 }, // 3 seconds delayed
);
```

Để thêm công việc vào cuối bên phải hàng đợi (LIFO) -> lifo=true.

```ts
const job = await this.audioQueue.add(
  {
    foo: 'bar',
  },
  { lifo: true },
);
```

Để ưu tiên một công việc -> priority

```ts
const job = await this.audioQueue.add(
  {
    foo: 'bar',
  },
  { priority: 2 },
);
```

## Consumers (Người tiêu dùng)

Là class xác định các method xử lý jobs được thêm vào queue hoặc lănngs nghe các sự kiện trên quêu hoặc cả 2

```ts
import { Processor } from '@nestjs/bull';

@Processor('audio')
export class AudioConsumer {}
```

Khai báo trình xử lý công việc bằng decorator @Process()

```ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('audio')
export class AudioConsumer {
  @Process()
  async transcode(job: Job<unknown>) {
    let progress = 0;
    for (i = 0; i < 100; i++) {
      await doSomething(job.data);
      progress += 10;
      job.progress(progress);
    }
    return {};
  }
}
```

**transcode()** được gọi bất cứ khi nào nhân viên không hoạt động và có công việc cần xử lý trong hàng đợi.

## Event listeners (Người nghe sự kiện)

Tập sự kiện khi queue và/hoặc trạng thai công việc thay đổi

Ví dụ lắng nghe sự kiện được phát ra khi một công việc dii vào trạng thái hoạt động trong **auddio** queue

```ts
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

@Processor('audio')
export class AudioConsumer {

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`,
    );
  }
  ...
```

Lắng nghe sự kiện toàn cục -> nhận **jobId(number)** trong phiên bản toàn cầu. Sử dụng **Queue#getJob** method để tham chiếu tới **job** obj và phải chờ nên sẽ sử dụng **async**

```ts
@OnGlobalQueueCompleted()
async onGlobalCompleted(jobId: number, result: any) {
  const job = await this.immediateQueue.getJob(jobId);
  console.log('(Global) on completed: job ', job.id, ' -> result: ', result);
}
```

## Queue management (Quản lý hàng đợi)

Cho phép thực hiện chức năng -> tạm dừng, tiếp tục, truy xuất lượng công việc ở các trạng thái khác nhau/

Ví dụ **pause()** method.

```ts
await audioQueue.pause();
```

Tiếp túc

```ts
await audioQueue.resume()
```

## Async configuration (Cấu hinh không đồng bô)

Sử dụng **registerQueueAsync()** method

```ts
BullModule.registerQueueAsync({
  name: 'audio',
  useFactory: () => ({
    redis: {
      host: 'localhost',
      port: 6379,
    },
  }),
});
```

Inject

```ts
BullModule.registerQueueAsync({
  name: 'audio',
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    redis: {
      host: configService.get('QUEUE_HOST'),
      port: +configService.get('QUEUE_PORT'),
    },
  }),
  inject: [ConfigService],
});
```

useClass syntax

```ts
BullModule.registerQueueAsync({
  name: 'audio',
  useClass: BullConfigService,
});
```

Cấu trúc trên sẽ khởi tạo **BullConfigService** trong **BullModule** và sử dụng nó để cung cấp một đối tượng tuỳ chọn bằng các call **createBullOptions()** -> **BullCOnfigService** phải triển khai **BuildOptionsFactory** interface

```ts
@Injectable()
class BullConfigService implements BullOptionsFactory {
  createBullOptions(): BullModuleOptions {
    return {
      redis: {
        host: 'localhost',
        port: 6379,
      },
    };
  }
}
```

Ngăn tạo **BullConfigService** trong **BullModule** và sử dụng trình cung cấp được import từ một module khác -> **useExisting** syntax

```ts
BullModule.registerQueueAsync({
  name: 'audio',
  imports: [ConfigModule],
  useExisting: ConfigService,
});
```