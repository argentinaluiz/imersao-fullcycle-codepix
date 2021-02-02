import { Console, Command } from 'nestjs-console';
import { ModuleRef } from '@nestjs/core';
import * as chalk from 'chalk';
import { getConnection, Repository } from 'typeorm';

@Console()
export class FixturesCommand {
  constructor(
    private moduleRef: ModuleRef,
  ) {}

  @Command({
    command: 'fixtures',
    description: 'Seed data in database',
  })
  async command(): Promise<void> {
    await this.preCommand();
    const fixtures = (await import(`./fixtures/bank-${process.env.BANK_CODE}`)).default;
    for (const fixture of fixtures) {
        await this.createData(fixture.model, fixture.fields);
     }

    console.log(chalk.green('Data generated'));
  }

  async preCommand(): Promise<void> {
    await this.runMigrations();
  }

  async createData(model: any, data: any): Promise<void> {
    const repository = this.getRepository(model);
    const obj = repository.create(data);
    await repository.save(obj);
  }

  async runMigrations(): Promise<void> {
    const conn = getConnection('default');
    for (const migration of conn.migrations.reverse()) {
      await conn.undoLastMigration();
    }
    await conn.runMigrations();
  }

  getRepository(model: any): Repository<any> {
    const conn = getConnection('default');
    return conn.getRepository(model);
  }
}
