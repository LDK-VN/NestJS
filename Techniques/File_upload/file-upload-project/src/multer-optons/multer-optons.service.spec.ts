import { Test, TestingModule } from '@nestjs/testing';
import { MulterOptonsService } from './multer-configs.service';

describe('MulterOptonsService', () => {
  let service: MulterOptonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MulterOptonsService],
    }).compile();

    service = module.get<MulterOptonsService>(MulterOptonsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
