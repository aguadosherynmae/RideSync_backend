import { IsInt } from 'class-validator';

export class BoardingDto {
  //Foreign Key
  @IsInt()
  driver_id: number;
}
