import {IsString, MaxLength, IsNumber, Max, Min, IsDateString} from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class PaymentDTO {
    @ApiProperty({example: 'На квартиру', description: 'Название платежа'})
    @IsString()
    @MaxLength(255)
    name: string;

    @ApiProperty({example: 7000, description: 'Сумма платежа'})
    @IsNumber()
    @Min(1)
    @Max(10000000)
    value: number;

    @ApiProperty({example: 1, description: 'Идентификатор категории'})
    @IsNumber()
    category: number;

    @ApiProperty({example: "Mon, 10 Nov 2025 21:00:40 GMT", description: 'Дата платежа'})
    @IsDateString()
    date: string;
}