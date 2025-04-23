import { IsString, MinLength, IsNotEmpty } from 'class-validator';

export class PasswordDto {
  @IsString()
  @IsNotEmpty()
  current_password: string;

  @MinLength(6)
  @IsNotEmpty()
  password: string;
}
