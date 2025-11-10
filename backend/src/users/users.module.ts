import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {User} from "./user.entity";
import { UsersService } from './users.service';
import {CommonModule} from "../common/common.module";
import { UsersController } from './users.controller';
import {AccountsModule} from "../banks/accounts/accounts.module";
import {TransactionsModule} from "../banks/accounts/transactions/transactions.module";

@Module({
    imports: [TypeOrmModule.forFeature([User]), AccountsModule, TransactionsModule],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [UsersService]
})
export class UsersModule {}
