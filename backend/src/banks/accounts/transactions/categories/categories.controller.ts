import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {JwtAuthGuard} from "../../../../auth/jwt-auth.guard";
import {User} from "../../../../common/decorators/user.decorator";
import {CategoriesService} from "./categories.service";

@ApiTags("Категории расходов")
@Controller('/transactions/categories')
export class CategoriesController {
    public constructor(private readonly categoriesService: CategoriesService) {
    }

    @ApiOperation({ summary: 'Получение расходов по категориям' })
    @ApiResponse({ status: 200, description: 'Список категорий с расходами' })
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public getAll(@User("id") userId: number) {
        return this.categoriesService.getCategories(userId);
    }
}
