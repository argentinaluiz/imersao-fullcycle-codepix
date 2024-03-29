import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PixKeyController } from './controllers/pix-key/pix-key.controller';
import { FixturesCommand } from './fixtures/fixtures.command';
import { ConsoleModule } from 'nestjs-console';
import { BankAccount } from './models/bank-account.model';
import { PixKey } from './models/pix-key.model';
import { TransactionController } from './controllers/transaction/transaction.controller';
import { Transaction } from './models/transaction.model';
import { BankAccountsController } from './controllers/bank-accounts/bank-accounts.controller';
import { TransactionSubscriber } from './subscribers/transaction-subscriber/transaction-subscriber';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConsoleModule,
    TypeOrmModule.forRoot({
      type: process.env.TYPEORM_CONNECTION as any,
      host: process.env.TYPEORM_HOST,
      port: parseInt(process.env.TYPEORM_PORT),
      username: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: process.env.TYPEORM_DATABASE,
      migrations: [__dirname + '/migrations/**/*.{ts,js}'],
      entities: [BankAccount, PixKey, Transaction],
    }),
    TypeOrmModule.forFeature([BankAccount, PixKey, Transaction]),
    ClientsModule.register([
      {
        name: 'CODEPIX_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_URL,
          package: 'github.com.codeedu.codepix',
          protoPath: [join(__dirname, 'proto/pixkey.proto')],
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'TRANSACTION_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: process.env.KAFKA_CLIENT_ID,
            brokers: [process.env.KAFKA_BROKER],
          },
          consumer: {
            groupId:
              !process.env.KAFKA_CONSUMER_GROUP_ID ||
              process.env.KAFKA_CONSUMER_GROUP_ID === ''
                ? 'my-consumer-' + Math.random()
                : process.env.KAFKA_CONSUMER_GROUP_ID,
          },
        },
      },
    ]),
  ],
  controllers: [
    AppController,
    PixKeyController,
    TransactionController,
    BankAccountsController,
  ],
  providers: [AppService, FixturesCommand, TransactionSubscriber],
})
export class AppModule {}
