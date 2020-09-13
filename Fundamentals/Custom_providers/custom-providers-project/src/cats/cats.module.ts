import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

const mockCatsService = {
    value : ['LDKVN']
}

@Module({
    controllers: [CatsController],
    providers: [{
        provide: CatsService,
        useValue: mockCatsService,
    }],
})
export class CatsModule {}
