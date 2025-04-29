import { IsDate, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FilterRecordDto {
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate() 
  date?: Date;
}