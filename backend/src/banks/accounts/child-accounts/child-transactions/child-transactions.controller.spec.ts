import { Test, TestingModule } from '@nestjs/testing';
import { ChildTransactionsController } from './child-transactions.controller';

describe('ChildTransactionsController', () => {
  let controller: ChildTransactionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildTransactionsController],
    }).compile();

    controller = module.get<ChildTransactionsController>(ChildTransactionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
