import { IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class BoardingDto {
  //Foreign Key
  @IsInt()
  driver_id: number;

  @IsString()
  @IsNotEmpty()
  current_loc: string;

  @IsNumber()
  @IsNotEmpty()
  current_lat: number;

  @IsNumber()
  @IsNotEmpty()
  current_long: number;
}
