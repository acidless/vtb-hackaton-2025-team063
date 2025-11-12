import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {User} from "../../common/decorators/user.decorator";
import {ExpensesService} from "./expenses.service";

@ApiTags("Расходы семьи")
@Controller('family/expenses')
export class ExpensesController {
    public constructor(private readonly expensesService: ExpensesService) {
    }

    @ApiOperation({ summary: 'Получение данных расходов семьи' })
    @ApiResponse({ status: 200, description: 'Расходы семьи по категориям' })
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async get(@User("id") userId: number) {
        return  this.expensesService.getFamilyExpenses(userId);
    }
}
