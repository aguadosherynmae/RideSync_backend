import { IsInt, IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class FareDto {
    @IsString()
    @IsNotEmpty()
    from_loc: String;

    @IsNumber()
    @IsNotEmpty()
    from_lat: number;

    @IsNumber()
    @IsNotEmpty()
    from_long: number;

    @IsString()
    @IsNotEmpty()
    to_loc: String;

    @IsNumber()
    @IsNotEmpty()
    to_lat: number;

    @IsNumber()
    @IsNotEmpty()
    to_long: number;

    @IsInt()
    @IsNotEmpty()
    amount: number;
}
