import { IsString, IsInt, MaxLength } from 'class-validator';

export class FeedbackDto {
  @IsInt()
  rating: number;

  @IsString()
  @MaxLength(500)
  message: string;
}
