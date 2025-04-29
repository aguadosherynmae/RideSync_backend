import { IsString, IsNotEmpty, IsInt, IsDate } from 'class-validator';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  token: string;

  @IsString()
  @IsNotEmpty()
  full_name: string;

  @IsInt()
  @IsNotEmpty()
  four_digits: number;

  @IsString()
  @IsNotEmpty()
  card_brand: string;

  @IsDate()
  expire_date: Date;
}
