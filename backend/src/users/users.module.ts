import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./user.entity";
import { UsersService } from './users.service';
import {CommonModule} from "../common/common.module";
import { UsersController } from './users.controller';
import {AccountsModule} from "../banks/accounts/accounts.module";
import {TransactionsModule} from "../banks/accounts/transactions/transactions.module";
import {RedisModule} from "../redis/redis.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), AccountsModule, TransactionsModule, RedisModule],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule {}
