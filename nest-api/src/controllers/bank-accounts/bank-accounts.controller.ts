import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BankAccount } from 'src/models/bank-account.model';
import { Repository } from 'typeorm';

@Controller('bank-accounts')
export class BankAccountsController {
  constructor(
    @InjectRepository(BankAccount)
    private bankAccountRepo: Repository<BankAccount>,
  ) {}

  @Get()
  index() {
    return this.bankAccountRepo.find();
  }

  @Get(':bankAccountId')
  show(
    @Param(
      'bankAccountId',
      new ParseUUIDPipe({ version: '4', errorHttpStatusCode: 422 }),
    )
    bankAccountId: string,
  ) {
    return this.bankAccountRepo.findOneOrFail(bankAccountId);
  }
}
