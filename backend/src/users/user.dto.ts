import {IsString, IsPhoneNumber, IsOptional, MaxLength} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class UserDTO {
    @ApiProperty({example: 'Олег', description: 'Имя пользователя'})
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({example: '+7 (999) 999-99-99', description: 'Номер телефона'})
    @IsPhoneNumber("RU", {message: "Неверный формат номера"})
    phone: string;

    @ApiProperty({description: 'Изображение'})
    avatar: string;

    @ApiProperty({nullable: true, description: 'Код приглашения для формирования семьи'})
    @IsString()
    @IsOptional()
    familyCode?: string;
}

export class UserCreateDTO extends UserDTO {
    @IsOptional()
    partner?: number;
}

export class UserEditDTO {
    @ApiProperty({nullable: true, example: 'Олег', description: 'Имя пользователя'})
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name?: string;

    @ApiProperty({nullable: true, example: '+7 (999) 999-99-99', description: 'Номер телефона'})
    @IsPhoneNumber("RU", {message: "Неверный формат номера"})
    @IsOptional()
    phone?: string;
}

export class UserLoginDTO {
    @ApiProperty({example: 1, description: 'Идентификатор пользователя'})
    id: number;
}