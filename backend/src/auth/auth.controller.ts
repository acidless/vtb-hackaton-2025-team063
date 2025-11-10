import {Body, Controller, Post, Put, Res, Get, UseGuards, Req, HttpCode, UploadedFile, UseInterceptors} from '@nestjs/common';
import {UserDTO, UserLoginDTO} from "../users/user.dto";
import {AuthService} from "./auth.service";
import {type Response} from 'express';
import {JwtAuthGuard} from "./jwt-auth.guard";
import {ApiBody, ApiConsumes, ApiCookieAuth, ApiOperation, ApiResponse, ApiTags} from "@nestjs/swagger";
import {FileInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";
import * as crypto from "node:crypto";
import { extname } from 'node:path';
import {UsersService} from "../users/users.service";
import {User} from "../common/decorators/user.decorator";

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
    public constructor(private authService: AuthService, private usersService: UsersService) {
    }

    @ApiOperation({ summary: 'Регистрация пользователя' })
    @ApiResponse({ status: 201, description: 'Зарегистрированный пользователь' })
    @ApiBody({ type: UserDTO })
    @ApiConsumes('multipart/form-data')
    @Post()
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('avatar', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = `avatar-${crypto.randomUUID()}`;
                return cb(null, `${randomName}${extname(file.originalname)}`);
            },
        }),
    }),)
    public async register(@UploadedFile() file: Express.Multer.File, @Body() dto: UserDTO, @Res() res: Response) {
        const data = await this.authService.register({...dto, avatar: `/uploads/${file.filename}`});

        res.cookie('access_token', data.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.send({success: true, data: {user: data.user}});
    }

    @ApiOperation({ summary: 'Вход пользователя в аккаунт' })
    @ApiResponse({ status: 200, description: 'Данные пользователя' })
    @ApiBody({ type: UserLoginDTO })
    @Put()
    public async login(@Body() dto: UserLoginDTO, @Res() res: Response) {
        const data = await this.authService.login(dto);

        res.cookie('access_token', data.accessToken, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24 * 7
        });

        return res.send({success: true, data: {user: data.user}});
    }

    @ApiOperation({ summary: 'Получение пользователя по его токену' })
    @ApiResponse({ status: 200, description: 'Данные пользователя' })
    @ApiCookieAuth('access_token')
    @Get()
    @UseGuards(JwtAuthGuard)
    public async getMe(@User("id") userId: number) {
        return this.usersService.findUser(userId);
    }
}
