import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, Interval, SchedulerRegistry, Timeout } from '@nestjs/schedule';

@Injectable()
export class TaskService {
    private readonly logger = new Logger(TaskService.name);

    constructor(private schedulerRegistry: SchedulerRegistry) {}

    @Cron('45 * * * * *') // Mỗi phút vào giây thứ 5
    handleCron() {
        this.logger.debug('Called when the current second is 45');
    }

    @Cron(CronExpression.EVERY_10_SECONDS)
    hanleCron2() {
        // this.logger.debug('Called every 10 seconds');
    }

    @Interval(10000)
    handleInterval() {
        this.logger.debug('Called every 10 seconds');
    }

    @Timeout(5000)
    handleTimeout() {
        this.logger.debug('Called once after 5 seconds');
    } 

    @Cron('35 * * * * *', {
        name: 'notification',
    })
    triggerNotifications() {
        console.log('notification when the current second is 35')
    }
}
