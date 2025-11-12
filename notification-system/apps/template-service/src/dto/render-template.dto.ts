import { IsObject, IsOptional, IsString } from "class-validator";

export class RenderTemplateDto {
  @IsObject()
  variables: Record<string, any>;

  @IsOptional()
  @IsString()
  language?: string;
}
