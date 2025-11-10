import { Module } from '@nestjs/common';
import { ConsentsController } from './consents.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Consent} from "./consent.entity";
import {BanksModule} from "../banks.module";
import { ConsentsService } from './consents.service';
import {RedisModule} from "../../redis/redis.module";

@Module({
  imports: [TypeOrmModule.forFeature([Consent]), BanksModule, RedisModule],
  controllers: [ConsentsController],
  providers: [ConsentsService],
  exports: [ConsentsService]
})
export class ConsentsModule {}
