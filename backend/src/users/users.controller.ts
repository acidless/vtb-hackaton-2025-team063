import {Body, Controller, Get, Patch, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../common/decorators/user.decorator";
import {User as UserEntity} from "./user.entity";
import {UserEditDTO} from "./user.dto";
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";

@ApiTags("Пользователи")
@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @ApiOperation({ summary: 'Изменение данных пользователя' })
    @ApiResponse({ status: 200, description: 'Измененный пользователь' })
    @ApiCookieAuth('access_token')
    @Patch("/me")
    @UseGuards(JwtAuthGuard)
    public async update(@User("id") userId: number, @Body() userEditDTO: UserEditDTO) {
        return this.usersService.editUser(userId, userEditDTO);
    }

    @ApiOperation({ summary: 'Получение основных данных пользователя' })
    @ApiResponse({ status: 200, description: 'Данные пользователя' })
    @ApiCookieAuth('access_token')
    @Get("/me")
    @UseGuards(JwtAuthGuard)
    public async get(@User() user: UserEntity) {
        const data = await this.usersService.getUserExtendedInfo(user.id);
        return {...user, ...data};
    }
}
