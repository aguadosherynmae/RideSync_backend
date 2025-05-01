import { IsInt, IsEnum } from 'class-validator';
import { RiskLevel } from '../entities/risk.entity';

export class UpdateRiskDto {
  @IsInt()
  value: number;
}
