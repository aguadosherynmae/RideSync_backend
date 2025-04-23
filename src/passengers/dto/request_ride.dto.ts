import { IsString, IsNotEmpty, IsInt, IsEnum } from 'class-validator';

export class RequesDto {
  @IsString()
  @IsNotEmpty()
  destination: string;
}