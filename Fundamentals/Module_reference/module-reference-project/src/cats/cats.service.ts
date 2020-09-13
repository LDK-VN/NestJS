import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { TransientService } from 'src/transient/transient.service';

@Injectable()
export class CatsService implements OnModuleInit {
    private transientService: TransientService;
    constructor(private moduleRef: ModuleRef) {}

    async onModuleInit() {    
        const transientServices = await Promise.all([
            this.moduleRef.resolve(TransientService),
            this.moduleRef.resolve(TransientService),
        ]);
        console.log(transientServices[0] === transientServices[1]); // false
    }
}
