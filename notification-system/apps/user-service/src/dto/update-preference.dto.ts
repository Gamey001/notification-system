import { IsBoolean, IsOptional, IsString, IsObject } from "class-validator";

export class UpdatePreferenceDto {
  @IsOptional()
  @IsBoolean()
  email_notifications_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  push_notifications_enabled?: boolean;

  @IsOptional()
  @IsBoolean()
  marketing_emails_enabled?: boolean;

  @IsOptional()
  @IsString()
  preferred_language?: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsObject()
  notification_categories?: Record<string, boolean>;
}
