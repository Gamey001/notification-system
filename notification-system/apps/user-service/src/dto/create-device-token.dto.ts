import { IsEnum, IsString, IsOptional } from "class-validator";
import { DeviceType } from "../entities/device-token.entity";

export class CreateDeviceTokenDto {
  @IsString()
  token: string;

  @IsEnum(DeviceType)
  device_type: DeviceType;

  @IsOptional()
  @IsString()
  device_name?: string;
}
