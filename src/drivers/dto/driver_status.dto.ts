import { IsInt, IsEnum, ValidateIf, IsNotEmpty, IsString } from 'class-validator';
import { Status } from '../entities/driver_status.entity';

export class DriverStatusDto {
  @IsEnum(Status)
  status: Status;
}
