import { User } from "./user.entity";
export declare class UserPreference {
    id: string;
    user_id: string;
    email_notifications_enabled: boolean;
    push_notifications_enabled: boolean;
    marketing_emails_enabled: boolean;
    preferred_language: string;
    timezone: string;
    notification_categories: Record<string, boolean>;
    created_at: Date;
    updated_at: Date;
    user: User;
}
