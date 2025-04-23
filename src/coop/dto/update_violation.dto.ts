import { IsString, IsEnum, IsOptional } from 'class-validator';
import { Severity } from '../entities/violation.entity';

export class UpdateViolationDto {
  @IsString()
  @IsOptional()
  name: string;

  @IsEnum(Severity)
  severity: Severity;
}
