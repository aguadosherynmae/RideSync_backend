import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Severity } from '../entities/violation.entity';

export class ViolationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(Severity)
  severity: Severity;
}
