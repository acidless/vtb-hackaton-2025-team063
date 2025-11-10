import {Controller, Get, UseGuards} from '@nestjs/common';
import {FamilyAccountsService} from "./family-accounts.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../common/decorators/user.decorator";

@Controller('family')
export class FamilyAccountsController {
    public constructor(private readonly familyAccountsService: FamilyAccountsService) {}

    @Get("/balance")
    @UseGuards(JwtAuthGuard)
    public async getSharedBalance(@User("id") userId: number) {
        const sharedBalance = await this.familyAccountsService.getSharedBalance(userId);
        return {sharedBalance};
    }
}
