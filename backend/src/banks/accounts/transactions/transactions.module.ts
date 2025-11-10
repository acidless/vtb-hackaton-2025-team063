import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import {AccountsModule} from "../accounts.module";
import { TransactionsController } from './transactions.controller';
import {BanksModule} from "../../banks.module";
import {ConsentsModule} from "../../consents/consents.module";

@Module({
  imports: [BanksModule, ConsentsModule, AccountsModule],
  providers: [TransactionsService],
  controllers: [TransactionsController],
  exports: [TransactionsService],
})
export class TransactionsModule {}
