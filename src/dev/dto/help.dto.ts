import { IsString, IsNotEmpty } from 'class-validator';

export class HelpDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  video_url: string;
}
