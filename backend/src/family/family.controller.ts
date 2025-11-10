import {Controller, Get, UseGuards} from '@nestjs/common';
import {ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FamilyService} from "./family.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../common/decorators/user.decorator";
import {User as UserEntity} from "../users/user.entity";
import {UsersService} from "../users/users.service";

@ApiTags("Семья")
@Controller('family')
export class FamilyController {
    constructor(private readonly familyService: FamilyService, private readonly userService: UsersService) {}

    @ApiOperation({ summary: 'Получение данных пользователей семьи' })
    @ApiResponse({ status: 200, description: 'Список пользователей' })
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async get(@User() user: UserEntity) {
        const member = await this.familyService.getFamilyMember(user.id);
        return [user, member];
    }

    @ApiOperation({ summary: 'Получение расширенных данных пользователей семьи' })
    @ApiResponse({ status: 200, description: 'Список пользователей' })
    @ApiCookieAuth('access_token')
    @Get("/finance")
    @UseGuards(JwtAuthGuard)
    public async getExtendedInfo(@User() user: UserEntity) {
        const myInfo = await this.userService.getUserExtendedInfo(user.id);
        const response = [{...user, ...myInfo}];

        const member = await this.familyService.getFamilyMember(user.id);
        if(member) {
            const memberInfo = await this.userService.getUserExtendedInfo(member?.id);
            response.push({...member, ...memberInfo});
        }

        return response;
    }
}
