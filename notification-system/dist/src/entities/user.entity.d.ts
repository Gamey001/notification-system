import { UserPreference } from "./user-preference.entity";
import { DeviceToken } from "./device-token.entity";
export declare class User {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    password: string;
    is_active: boolean;
    phone_number: string;
    created_at: Date;
    updated_at: Date;
    preference: UserPreference;
    device_tokens: DeviceToken[];
}
