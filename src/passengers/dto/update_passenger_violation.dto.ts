import { IsInt, IsString } from 'class-validator';

export class UpdatePassengerViolationDto {
    @IsString()
    violation: string;
}
