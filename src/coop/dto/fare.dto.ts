import { IsInt, IsString, IsNotEmpty } from 'class-validator';

export class FareDto {
    @IsString()
    @IsNotEmpty()
    route_from: String;

    @IsString()
    @IsNotEmpty()
    route_to: String;

    @IsInt()
    @IsNotEmpty()
    amount: number;
}
