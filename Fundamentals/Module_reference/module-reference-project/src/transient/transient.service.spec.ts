import { Test, TestingModule } from '@nestjs/testing';
import { TransientService } from './transient.service';

describe('TransientService', () => {
  let service: TransientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransientService],
    }).compile();

    service = module.get<TransientService>(TransientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
