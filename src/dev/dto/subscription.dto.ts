import { IsNotEmpty, IsNumber } from 'class-validator';

export class SubscriptionDto {
  @IsNumber()
  @IsNotEmpty()
  duration: number;

  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
