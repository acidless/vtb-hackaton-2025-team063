import {Body, Controller, Delete, Get, HttpCode, Param, Post, UseGuards} from '@nestjs/common';
import {LimitsService} from "./limits.service";
import {JwtAuthGuard} from "../../auth/jwt-auth.guard";
import {User} from "../../common/decorators/user.decorator";
import {LimitDTO} from "./limit.dto";

@Controller('limits')
export class LimitsController {
    constructor(private readonly limitsService: LimitsService) {
    }

    @Post()
    @UseGuards(JwtAuthGuard)
    @HttpCode(201)
    public async create(@User("id") userId: number, @Body() limitDTO: LimitDTO) {
        return this.limitsService.create(userId, limitDTO);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    public async getAll(@User("id") userId: number) {
        return this.limitsService.getAll(userId);
    }

    @Delete("/:limitId")
    @HttpCode(204)
    @UseGuards(JwtAuthGuard)
    public async delete(@Param("limitId") limitId: number, @User("id") userId: number) {
        const result = await this.limitsService.delete(userId, limitId);
    }
}
