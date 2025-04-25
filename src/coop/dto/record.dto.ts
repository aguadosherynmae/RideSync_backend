import { IsInt } from 'class-validator';
export class RecordDto {
  //Foreign Key
  @IsInt()
  driver_id: number;

  @IsInt()
  violation_id: number;
}
