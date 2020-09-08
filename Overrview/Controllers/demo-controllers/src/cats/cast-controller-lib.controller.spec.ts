import { Test, TestingModule } from '@nestjs/testing';
import { CastControllerLibController } from './cast-controller-lib.controller';

describe('CastControllerLibController', () => {
  let controller: CastControllerLibController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CastControllerLibController],
    }).compile();

    controller = module.get<CastControllerLibController>(CastControllerLibController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
