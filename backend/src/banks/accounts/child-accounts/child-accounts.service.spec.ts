import { Test, TestingModule } from '@nestjs/testing';
import { ChildAccountsService } from './child-accounts.service';

describe('ChildAccountsService', () => {
  let service: ChildAccountsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChildAccountsService],
    }).compile();

    service = module.get<ChildAccountsService>(ChildAccountsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
