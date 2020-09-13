import { Test, TestingModule } from '@nestjs/testing';
import { Cats2Controller } from './cats2.controller';

describe('Cats2Controller', () => {
  let controller: Cats2Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [Cats2Controller],
    }).compile();

    controller = module.get<Cats2Controller>(Cats2Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
