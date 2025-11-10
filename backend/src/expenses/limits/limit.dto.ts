import {IsString, MaxLength, IsNumber, Max, Min, IsIn} from 'class-validator';

export class LimitDTO {
    @IsString()
    @MaxLength(255)
    name: string;

    @IsNumber()
    @Min(1)
    @Max(10000000)
    limit: number;

    @IsNumber()
    category: number;

    @IsString()
    @IsIn(["week", "month", "year"])
    period: "week" | "month" | "year";
}