import { Test, TestingModule } from '@nestjs/testing';
import { HttpServiceService } from './http-service.service';

describe('HttpServiceService', () => {
  let service: HttpServiceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HttpServiceService],
    }).compile();

    service = module.get<HttpServiceService>(HttpServiceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
