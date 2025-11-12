import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  MinLength,
} from "class-validator";
import { TemplateType } from "../entities/template.entity";

export class CreateTemplateDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(TemplateType)
  type: TemplateType;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

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
}
