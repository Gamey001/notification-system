import {
  IsString,
  IsEnum,
  IsOptional,
  IsArray,
  MinLength,
} from "class-validator";
import { TemplateStatus } from "../entities/template.entity";

export class UpdateTemplateDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(TemplateStatus)
  status?: TemplateStatus;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];
}
