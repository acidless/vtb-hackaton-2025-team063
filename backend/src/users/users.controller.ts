import {Body, Controller, Patch, UseGuards} from '@nestjs/common';
import {UsersService} from "./users.service";
import {JwtAuthGuard} from "../auth/jwt-auth.guard";
import {User} from "../common/decorators/user.decorator";
import {UserEditDTO} from "./user.dto";

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Patch()
    @UseGuards(JwtAuthGuard)
    public async update(@User("id") userId: number, @Body() userEditDTO: UserEditDTO) {
        return this.usersService.editUser(userId, userEditDTO);
    }
}
