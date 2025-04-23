import { IsInt } from 'class-validator';

export class ReportDto {
    @IsInt()
    violation_id: number;
}
