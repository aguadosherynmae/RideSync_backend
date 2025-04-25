import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class BoardingDto {
  //Foreign Key
  @IsInt()
  driver_id: number;

  @IsString()
  @IsNotEmpty()
  current_loc: string;
}
