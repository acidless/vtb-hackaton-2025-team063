import { Module } from '@nestjs/common';
import { LimitsService } from './limits.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Limit} from "./limit.entity";
import { LimitsController } from './limits.controller';
import {FamilyModule} from "../../family/family.module";

@Module({
  imports: [TypeOrmModule.forFeature([Limit]), FamilyModule],
  providers: [LimitsService],
  controllers: [LimitsController]
})
export class LimitsModule {}
