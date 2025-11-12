import {
  IsString,
  IsEmail,
  IsObject,
  IsOptional,
  IsUUID,
} from "class-validator";

export class SendEmailDto {
  @IsUUID()
  id: string;

  @IsUUID()
  correlation_id: string;

  @IsUUID()
  user_id: string;

  @IsUUID()
  template_id: string;

  @IsEmail()
  recipient_email: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  html_content?: string;

  @IsObject()
  variables: Record<string, any>;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;

  @IsOptional()
  retry_count?: number;
}
