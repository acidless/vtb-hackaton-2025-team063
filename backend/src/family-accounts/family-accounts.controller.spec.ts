import { Test, TestingModule } from '@nestjs/testing';
import { FamilyAccountsController } from './family-accounts.controller';

describe('FamilyAccountsController', () => {
  let controller: FamilyAccountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FamilyAccountsController],
    }).compile();

    controller = module.get<FamilyAccountsController>(FamilyAccountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
