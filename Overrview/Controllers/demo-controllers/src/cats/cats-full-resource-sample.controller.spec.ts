import { Test, TestingModule } from '@nestjs/testing';
import { CatsFullResourceSampleController } from './cats-full-resource-sample.controller';

describe('CatsFullResourceSampleController', () => {
  let controller: CatsFullResourceSampleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsFullResourceSampleController],
    }).compile();

    controller = module.get<CatsFullResourceSampleController>(CatsFullResourceSampleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
