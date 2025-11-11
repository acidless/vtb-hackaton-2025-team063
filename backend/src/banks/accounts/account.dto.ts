import {IsString, IsIn} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class AccountDTO {
    @ApiProperty({example: 'checking', description: 'Тип счета'})
    @IsString()
    @IsIn(['checking', 'savings'])
    type: "checking" | "savings";
}

export class AccountCloseDTO {
    @ApiProperty({example: 'transfer', description: 'Действие с остатком на счете'})
    @IsString()
    @IsIn(['transfer', 'donate'])
    action: "transfer" | "donate";
}