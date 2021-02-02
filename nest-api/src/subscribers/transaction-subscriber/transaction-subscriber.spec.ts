import { Test, TestingModule } from '@nestjs/testing';
import { TransactionSubscriber } from './transaction-subscriber';

describe('TransactionSubscriber', () => {
  let service: TransactionSubscriber;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransactionSubscriber],
    }).compile();

    service = module.get<TransactionSubscriber>(TransactionSubscriber);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
