import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import {BanksModule} from "../banks.module";
import {ConsentsModule} from "../consents/consents.module";
import { AccountsController } from './accounts.controller';
import {RedisModule} from "../../redis/redis.module";

@Module({
  imports: [BanksModule, ConsentsModule, RedisModule],
  providers: [AccountsService],
  controllers: [AccountsController],
  exports: [AccountsService]
})
export class AccountsModule {}
