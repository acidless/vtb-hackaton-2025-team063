import {IsString, IsNumber, Max, Min} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class ChildAccountDTO {
    @ApiProperty({example: 2500, description: 'Сумма в день'})
    @IsNumber()
    @Type(() => Number)
    @Min(1)
    @Max(1000000)
    moneyPerDay: number;

    @ApiProperty({description: 'Изображение'})
    avatar: string;

    @ApiProperty({example: "abank", description: 'Иконка цели'})
    @IsString()
    bankId: string;
}

export class UpdateChildAccountDTO {
    @ApiProperty({example: 2500, description: 'Сумма в день'})
    @IsNumber()
    @Min(1)
    @Max(1000000)
    moneyPerDay?: number;
}