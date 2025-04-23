import { IsInt, IsString } from 'class-validator';

export class PassengerViolationDto {
    //Foreign Key
    @IsInt()
    passenger_id: number;

    @IsString()
    violation: string;
}
