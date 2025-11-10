import { User } from "./user.entity";
export declare enum DeviceType {
    IOS = "ios",
    ANDROID = "android",
    WEB = "web"
}
export declare class DeviceToken {
    id: string;
    user_id: string;
    token: string;
    device_type: DeviceType;
    device_name: string;
    is_active: boolean;
    last_used_at: Date;
    created_at: Date;
    updated_at: Date;
    user: User;
}
