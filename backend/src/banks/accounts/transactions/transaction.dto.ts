import {ApiProperty} from "@nestjs/swagger";
import {IsNumber} from "class-validator";

export class TransactionDTO {
    @ApiProperty({example: 1, description: 'Идентификатор категории'})
    @IsNumber()
    categoryId: number;
}