import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FamilyAccountsService} from "./family-accounts.service";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {User} from "../../common/decorators/user.decorator";

@ApiTags("Общие счета")
@Controller('family/accounts')
export class FamilyAccountsController {
    public constructor(private familyAccountsService: FamilyAccountsService) {}

    @ApiOperation({ summary: 'Получение данных о счетах семьи' })
    @ApiResponse({ status: 200, description: 'Список счетов' })
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async get(@User("id") userId: number) {
        return this.familyAccountsService.getAccounts(userId);
    }
}
