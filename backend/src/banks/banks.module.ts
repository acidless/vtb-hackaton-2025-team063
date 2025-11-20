import { Module } from '@nestjs/common';
import { BanksService } from './banks.service';
import {HttpModule} from "@nestjs/axios";
import {RedisModule} from "../redis/redis.module";

@Module({
  imports: [HttpModule, RedisModule],
  providers: [BanksService],
  exports: [BanksService],
})
export class BanksModule {}
