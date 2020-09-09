import { HelmetMiddleware } from './helmet.middleware';

describe('HelmetMiddleware', () => {
  it('should be defined', () => {
    expect(new HelmetMiddleware()).toBeDefined();
  });
});
