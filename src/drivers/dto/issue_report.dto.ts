import { IsNotEmpty, IsString } from 'class-validator';

export class IssueReportDto {
  @IsNotEmpty()
  @IsString()
  issue_desc?: string;
}
