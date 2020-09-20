# Task Scheduling (Lập lịch tác vụ)

Lên lịch thực hiện định kỳ cho code (function/method) tuỳ ý thự thi vào một ngày / giờ cố định, theo một khoảng thời gian định kỳ hoặc sau một khoảng thời gian xác định.

## Installation (Cài đặt)

```bash
$ npm install --save @nestjs/schedule
```

Import **ScheduleModule.forRoot()** trong **AppModule**

```ts
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ScheduleModule.forRoot()
  ],
})
export class AppModule {}
```

Đăng ký xảy ra khi **onApplicationBootstrap** chạy, đảm bảo all mudle đã load và khai báo tất cả những công việc nào đã lên lịch.

# Declarative crom jobs (Khai báo công việc cron)

Một công việc cron lên lịch cho một hàm tuỳ ý (gọi method) chạy tự động

* Một lần, vào một ngày/ giờ xác định
* Trên cơ sở định kỳ; công việc -> chạy tại một thời điểm, thời gian cụ thể (mỗi giờ, mỗi ngày, mỗi tuần, mỗi 5 phút)

Khai báo cron job với **@Cron** decorator

```ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron('45 * * * * *')
  handleCron() {
    this.logger.debug('Called when the current second is 45');
  }
}
```
**@Cron** hỗ trợ tất cả [cron-patterns](http://crontab.org/) tiêu chuẩn:

* Asterik (Dấu hoa thị) (e.g. *)
* Ranges (phạm vi) (e.g. 1-3,5)
* Steps (các bước) (e.g. */2)

45 * * * * * cho biết:

```ts
* * * * * *
| | | | | |
| | | | | day of week
| | | | month
| | | day of month
| | hour
| minute
second (optional)
```

Vài mẫu cron:

```
* * * * *         : Mỗi giây

45 * * * * *      : Mỗi phút, vào giấy thứ 45

* 10 * * * *      : Mỗi giờ, vào đầu phút thứ 10

0 */30 9-17 * * * : Cứ sau 30 phút từ 9 giờ sáng tới 5 giờ chiều

0 30 11 * * 1-5   : Thứ Hai đến Thứ sáu lúc 11:30 sáng
```

Có thể sử dụng **enum** như sau:

```ts
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  @Cron(CronExpression.EVERY_45_SECONDS)
  handleCron() {
    this.logger.debug('Called every 45 seconds');
  }
}
```

## Declarative intervals (các khoảng khai báo)

Khai báo khoảng thời gian call method định kỳ -> **@Interval() decorator. Thời gian tính mili giây

```ts
@Interval(10000)
handleInterval() {
  this.logger.debug('Called every 10 seconds');
}
```

Kiểm soát thời gian khai báo từ bên ngoài khai báo class thông qua API động -> Liên kết khoảng thời gian với tên

```ts
@Interval('notifications', 2500)
handleInterval() {}
```

## Declarative timeouts (Thời gian chờ so sánh)

Chỉ định method chạy một lần -> **@Timeout()** decorator (time truyền vào tính bằng mili giấy).

```ts
@Timeout(5000)
handleTimeout() {
  this.logger.debug('Called once after 5 seconds');
}
```

Kiểm soát thời gian chờ khai báo từ bên ngoài lớp khai báo thông qua API đọng -> liên kết thời gian chờ với tên

```ts
@Timeout('notifications', 2500)
handleTimeout() {}
```

## Dynamic schedule module API (API lịch trình động)

Cung cấp API cho phép quản lý khai báo -> cron jobs, timeouts, intervals. Cho phép tạo và quản lý các **dynamic** cron jobs, timeouts và intervals trong đó properties chạy trong runtime.

## Dynamic cron jobs

Inject **SchedulerRegistry** trong constructor:

```ts
constructor(private schedulerRegistry: SchedulerRegistry) {}
```

Sử dụng trong một lớp như sau. Giả sử một cron job được khởi tạo và khai báo như sau:

```ts
@Cron('* * 8 * * *', {
  name: 'notifications',
})
triggerNotifications() {}
```

Truy cập job

```ts
const job = this.schedulerRegistry.getCronJob('notifications');

job.stop();
console.log(job.lastDate());
```

Các **getCronJob()** method trả về tên cron job:

* **stop()**  : dùng một công việc đã được lên lịch để chạy.
* **start()** : khởi động lại một công việc đã bị dừng.
* **setTime(time: CronTime)** : dừng một công việc, đặt thời gian cho nó, và sau đó bắt đầu nó.
* **lastDate()**: trả về một biểu diễn chuỗi của ngày cuối cùng một công việc được thực hiện.
* **nextDates(count: number)**: trả về một mảng (kích thước **count**) các **moment** đối tượng đại diện cho ngày thực hiện công việc sắp tới

Tạo động cron job mới -> **ScheduleRegistry.addCronJob()** method:

```ts
addCronJob(name: string, seconds: string) {
  const job = new CronJob(`${seconds} * * * * *`, () => {
    this.logger.warn(`time (${seconds}) for job ${name} to run!`);
  });

  this.scheduler.addCronJob(name, job);
  job.start();

  this.logger.warn(
    `job ${name} added for each minute at ${seconds} seconds!`,
  );
}
```

Xoá cron job bằng tên -> **SchedulerRegistry.deleteCronJob()** method

```ts
deleteCron(name: string) {
  this.scheduler.deleteCronJob(name);
  this.logger.warn(`job ${name} deleted!`);
}
```

Liệt ke tất cac cron job -> **SchedulerRegistry.getCronJobs()** method:

```ts
getCrons() {
  const jobs = this.scheduler.getCronJobs();
  jobs.forEach((value, key, map) => {
    let next;
    try {
      next = value.nextDates().toDate();
    } catch (e) {
      next = 'error: next fire date is in the past!';
    }
    this.logger.log(`job: ${key} -> next: ${next}`);
  });
}
```

## Dynamic intervals (Khoảng động)

Nhận tham chiếu đến một khoảng thời gian -> **SchedulerRegistry.getInterval()** method.

```ts
constructor(private schedulerRegistry: SchedulerRegistry) {}
```

Sử dụng

```ts
const interval = this.schedulerRegistry.getInterval('notifications');
clearInterval(interval);
```

Tạo khoảng thời gian động mới -> **SchedulerRegistry.addInterval()** method.

```ts
addInterval(name: string, seconds: string) {
  const callback = () => {
    this.logger.warn(`Interval ${name} executing at time (${seconds})!`);
  };

  const interval = setInterval(callback, seconds);
  this.scheduler.addInterval(name, interval);
}
```

Xoá khoảng thời gian đã đặt tên -> **SchedulerRegistry.deleteInterval()** method

```ts
deleteInterval(name: string) {
  this.scheduler.deleteInterval(name);
  this.logger.warn(`Interval ${name} deleted!`);
}
```

Liệt kê all khoảng thời gian -> **SchedulerRegistry.getIntervals()** method:

```ts
getIntervals() {
  const intervals = this.scheduler.getIntervals();
  intervals.forEach(key => this.logger.log(`Interval: ${key}`));
}
```

## Dynamic timeouts

Inject **SchedulerRegister** trong constructor

```ts
constructor(private schedulerRegistry: SchedulerRegistry) {}
```

Sử dụng

```ts
const timeout = this.schedulerRegistry.getTimeout('notifications');
clearTimeout(timeout
```

Tạo dynamically timeout -> **SchedulerRegistry.addTimeout()** method:

```ts
addTimeout(name: string, seconds: string) {
  const callback = () => {
    this.logger.warn(`Timeout ${name} executing after (${seconds})!`);
  };

  const timeout = setTimeout(callback, seconds);
  this.scheduler.addTimeout(name, timeout);
}
```

Xoá timeout -> **SchedulerRegistry.deleteTimeout()** method:

```ts
deleteTimeout(name: string) {
  this.scheduler.deleteTimeout(name);
  this.logger.warn(`Timeout ${name} deleted!`);
}
```

Liệt kê all timeout -> **SchedulerRegistry.getTimeouts()** method:

```ts
etTimeouts() {
  const timeouts = this.scheduler.getTimeouts();
  timeouts.forEach(key => this.logger.log(`Timeout: ${key}`));
}
```