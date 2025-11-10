export declare class UpdatePreferenceDto {
    email_notifications_enabled?: boolean;
    push_notifications_enabled?: boolean;
    marketing_emails_enabled?: boolean;
    preferred_language?: string;
    timezone?: string;
    notification_categories?: Record<string, boolean>;
}
