import { Module } from '@nestjs/common';
import {CategoriesModule} from "../../banks/accounts/transactions/categories/categories.module";
import {RedisModule} from "../../redis/redis.module";
import { ExpensesService } from './expenses.service';
import {FamilyModule} from "../family.module";
import { ExpensesController } from './expenses.controller';

@Module({
    imports: [CategoriesModule, RedisModule, FamilyModule],
    providers: [ExpensesService],
    controllers: [ExpensesController]
})
export class ExpensesModule {}
