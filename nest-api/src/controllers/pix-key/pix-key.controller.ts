import {
  Body,
  Controller,
  Get,
  HttpCode,
  Inject,
  InternalServerErrorException,
  NotFoundException,
  OnModuleInit,
  Param,
  ParseUUIDPipe,
  Post,
  Query,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { PixKeyExistsDto } from 'src/dto/pix-key-exists.dto';
import { PixKeyDto } from 'src/dto/pix-key.dto';
import { PixService } from 'src/grpc/pix-service';
import { BankAccount } from 'src/models/bank-account.model';
import { PixKey } from 'src/models/pix-key.model';
import { Repository } from 'typeorm';

@Controller('bank-accounts/:bankAccountId/pix-keys')
export class PixKeyController implements OnModuleInit {
  private pixGrpc: PixService;

  constructor(
    @Inject('CODEPIX_PACKAGE') private client: ClientGrpc,
    @InjectRepository(BankAccount)
    private bankAccountRepo: Repository<BankAccount>,
    @InjectRepository(PixKey)
    private pixKeyRepo: Repository<PixKey>,
  ) {}

  onModuleInit() {
    this.pixGrpc = this.client.getService('PixService');
  }

  @Get()
  async index(
    @Param(
      'bankAccountId',
      new ParseUUIDPipe({ version: '4', errorHttpStatusCode: 422 }),
    )
    bankAccountId: string,
  ) {
    return this.pixKeyRepo.find({ 
      where: {
        bank_account_id: bankAccountId
      },
      order: { created_at: 'DESC' } 
    });
  }

  @Post('')
  async store(
    @Param(
      'bankAccountId',
      new ParseUUIDPipe({ version: '4', errorHttpStatusCode: 422 }),
    )
    bankAccountId: string,
    @Body(new ValidationPipe({ errorHttpStatusCode: 422 }))
    body: PixKeyDto,
  ) {
    const bankAccount = await this.bankAccountRepo.findOneOrFail(bankAccountId);
    const notFound = await this.checkPixKeyNotFound(body);
    if (!notFound) {
      throw new UnprocessableEntityException('PixKey already exists');
    }

    const createdPixKey = await this.pixGrpc
      .registerPixKey({
        ...body,
        accountId: bankAccount.id,
      })
      .toPromise();

    if (createdPixKey.error) {
      throw new InternalServerErrorException(createdPixKey.error);
    }

    const pixKey = this.pixKeyRepo.create({
      id: createdPixKey.id,
      bank_account_id: bankAccount.id,
      ...body,
    });
    return await this.pixKeyRepo.save(pixKey);
  }

  async checkPixKeyNotFound(params: PixKeyExistsDto) {
    try {
      await this.pixGrpc.find(params).toPromise();
      return false;
    } catch (e) {
      if (e.details === 'no key was found') {
        return true;
      }

      throw new InternalServerErrorException('Server not available');
    }
  }

  @Get('exists')
  @HttpCode(204)
  async exists(
    @Query(new ValidationPipe({ errorHttpStatusCode: 422 }))
    params: PixKeyExistsDto,
  ) {
    try {
      await this.pixGrpc.find(params).toPromise();
    } catch (e) {
      if (e.details === 'no key was found') {
        throw new NotFoundException(e.details);
      }

      throw new InternalServerErrorException('Server not available');
    }
  }
}