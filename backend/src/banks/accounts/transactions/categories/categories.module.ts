import { Module } from '@nestjs/common';
import {TransactionsModule} from "../transactions.module";
import {RedisModule} from "../../../../redis/redis.module";
import { CategoriesService } from './categories.service';
import { CategoriesController } from './categories.controller';

@Module({
    imports: [TransactionsModule, RedisModule],
    providers: [CategoriesService],
    controllers: [CategoriesController],
    exports: [CategoriesService],
})
export class CategoriesModule {}
