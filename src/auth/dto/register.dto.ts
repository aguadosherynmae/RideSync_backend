import { IsEmail, IsEnum, IsString, IsNotEmpty, MinLength, ValidateIf, IsNumber, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class RegisterDto {
  @IsEnum(UserRole)
  role: UserRole;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;

  // Passenger & Coop
  @ValidateIf((o) => o.role === UserRole.PASSENGER || o.role === UserRole.COOP || o.role === UserRole.DEV)
  @IsString()
  @IsNotEmpty()
  username: string;

  // Driver Profile 
  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsString()
  @IsNotEmpty()
  first_name: string;

  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsString()
  @IsOptional()
  middle_name: string;

  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsString()
  @IsNotEmpty()
  last_name: string;

  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsString()
  @IsNotEmpty()
  address: string;

  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsNumber()
  @IsNotEmpty()
  age: number;

  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsString()
  @IsNotEmpty()
  cell_num: string;

  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsString()
  @IsNotEmpty()
  license_no: string;

  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsString()
  @IsNotEmpty()
  plate_number: string;

  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsString()
  @IsNotEmpty()
  route_one: string;

  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsString()
  @IsNotEmpty()
  route_two: string;

  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsOptional()
  driver_img?: string;

  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsNumber()
  @IsNotEmpty()
  coop_id: number;

  //Driver Bus
  @ValidateIf((o) => o.role === UserRole.DRIVER)
  @IsNotEmpty()
  capacity: number;
}
