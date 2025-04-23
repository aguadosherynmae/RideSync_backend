import { IsNotEmpty, IsEnum } from 'class-validator';
import { DiscountStatus } from '../entities/passenger_profile.entity';

export class UpdateProfileDto {
  @IsEnum(DiscountStatus)
  @IsNotEmpty()
  discount_status?: DiscountStatus;
}
