import { IsString, IsNotEmpty, IsInt, IsEnum, IsNumber } from 'class-validator';

export class RequesDto {
  @IsString()
  @IsNotEmpty()
  dest_loc: string;

  @IsNumber()
  @IsNotEmpty()
  dest_lat: number;

  @IsNumber()
  @IsNotEmpty()
  dest_long: number;
}