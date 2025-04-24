import { IsString, IsOptional, IsNumber, IsNotEmpty } from 'class-validator';

export class UpdateDriverProfileDto {
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @IsString()
  @IsOptional()
  middle_name: string;

  @IsString()
  @IsNotEmpty()
  last_name: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsNotEmpty()
  cell_num: string;

  @IsString()
  @IsNotEmpty()
  license_no: string;

  @IsString()
  @IsNotEmpty()
  plate_number: string;

  @IsString()
  @IsNotEmpty()
  route_one: string;

  @IsString()
  @IsNotEmpty()
  route_two: string;

  @IsString()
  @IsOptional()
  driver_img?: string;

  @IsNumber()
  @IsNotEmpty()
  capacity: number;
}
