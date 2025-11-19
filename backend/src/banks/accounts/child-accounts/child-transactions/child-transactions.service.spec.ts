import { Test, TestingModule } from '@nestjs/testing';
import { ChildTransactionsService } from './child-transactions.service';

describe('ChildTransactionsService', () => {
  let service: ChildTransactionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChildTransactionsService],
    }).compile();

    service = module.get<ChildTransactionsService>(ChildTransactionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
