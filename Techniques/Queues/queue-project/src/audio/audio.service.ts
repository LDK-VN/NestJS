import { InjectQueue } from '@nestjs/bull';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';

@Injectable()
export class AudioService {
    constructor(@InjectQueue('audio')private audioQueue: Queue) {}
}
