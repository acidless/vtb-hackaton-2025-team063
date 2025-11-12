import { Test, TestingModule } from '@nestjs/testing';
import { ChildAccountsController } from './child-accounts.controller';

describe('ChildAccountsController', () => {
  let controller: ChildAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChildAccountsController],
    }).compile();

    controller = module.get<ChildAccountsController>(ChildAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
