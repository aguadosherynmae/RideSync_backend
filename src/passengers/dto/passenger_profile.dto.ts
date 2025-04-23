import { IsString, IsNotEmpty, IsInt, IsOptional, IsEnum, IsDateString, ValidateIf } from 'class-validator';
import { DiscountType } from '../entities/passenger_profile.entity';

export class PassengerProfileDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsOptional()
  middle_name?: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsInt()
  age: number;

  @IsDateString()
  birth_date: string;

  @IsString()
  @IsOptional()
  passenger_img?: string;

  @IsEnum(DiscountType)
  @IsOptional()
  discount_type?: DiscountType;

  @ValidateIf((o) => o.discount_type === DiscountType.SENIOR || o.discount_type === DiscountType.STUDENT || o.discount_type === DiscountType.PWD)
  @IsString()
  @IsNotEmpty()
  proof_img?: string;
}
