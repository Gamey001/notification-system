import { DeviceType } from "../entities/device-token.entity";
export declare class CreateDeviceTokenDto {
    token: string;
    device_type: DeviceType;
    device_name?: string;
}
