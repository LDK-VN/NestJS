import { Test, TestingModule } from '@nestjs/testing';
import { CastTwoController } from './cast-two.controller';

describe('CastTwoController', () => {
  let controller: CastTwoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CastTwoController],
    }).compile();

    controller = module.get<CastTwoController>(CastTwoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
