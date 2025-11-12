import { IsString, IsOptional, IsArray } from "class-validator";

export class CreateVersionDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  html_content?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @IsArray()
  variables?: string[];

  @IsOptional()
  @IsString()
  change_notes?: string;
}
