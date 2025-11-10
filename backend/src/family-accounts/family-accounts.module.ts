import { Module } from '@nestjs/common';
import { FamilyAccountsService } from './family-accounts.service';
import {FamilyModule} from "../family/family.module";
import {AccountsModule} from "../banks/accounts/accounts.module";
import { FamilyAccountsController } from './family-accounts.controller';

@Module({
  imports: [FamilyModule, AccountsModule],
  providers: [FamilyAccountsService],
  controllers: [FamilyAccountsController]
})
export class FamilyAccountsModule {}
