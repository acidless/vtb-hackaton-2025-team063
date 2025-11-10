import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {FamilyModule} from "../family/family.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Payment} from "./payment.entity";
import {RedisModule} from "../redis/redis.module";
import { PaymentsController } from './payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Payment]), FamilyModule, RedisModule],
  providers: [PaymentsService],
  controllers: [PaymentsController]
})
export class PaymentsModule {}
