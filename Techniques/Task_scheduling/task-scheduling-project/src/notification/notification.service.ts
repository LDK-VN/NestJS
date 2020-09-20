import { Injectable } from '@nestjs/common';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';

@Injectable()
export class NotificationService {

    constructor(private schedulerRegistry: SchedulerRegistry) {}

    @Timeout(10000)
    stop() {
        const job = this.schedulerRegistry.getCronJob('notification');

        job.stop();
        console.log(job.lastDate())
    }

    @Timeout(11000)
    start() {
        const job = this.schedulerRegistry.getCronJob('notification');

        job.start();
        console.log(job.lastDate())
    }
}
