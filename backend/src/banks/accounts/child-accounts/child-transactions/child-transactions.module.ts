import {Module} from '@nestjs/common';
import {ChildTransactionsService} from './child-transactions.service';
import {TransactionsModule} from "../../transactions/transactions.module";
import {FamilyModule} from "../../../../family/family.module";
import {RedisModule} from "../../../../redis/redis.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ChildAccount} from "../child-account.entity";
import { ChildTransactionsController } from './child-transactions.controller';
import {CategoriesModule} from "../../transactions/categories/categories.module";

@Module({
    imports: [TypeOrmModule.forFeature([ChildAccount]), TransactionsModule, RedisModule, FamilyModule, CategoriesModule],
    providers: [ChildTransactionsService],
    controllers: [ChildTransactionsController]
})
export class ChildTransactionsModule {
}
