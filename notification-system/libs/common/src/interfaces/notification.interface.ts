export enum NotificationType {
  EMAIL = "email",
  PUSH = "push",
}

export enum NotificationStatus {
  PENDING = "pending",
  PROCESSING = "processing",
  SENT = "sent",
  FAILED = "failed",
  RETRYING = "retrying",
}

export interface NotificationPayload {
  id: string;
  correlation_id: string;
  type: NotificationType;
  user_id: string;
  template_id: string;
  variables: Record<string, any>;
  recipient: {
    email?: string;
    device_token?: string;
  };
  metadata?: Record<string, any>;
  retry_count?: number;
  created_at: Date;
}

export interface NotificationResult {
  id: string;
  correlation_id: string;
  status: NotificationStatus;
  sent_at?: Date;
  error?: string;
  metadata?: Record<string, any>;
}
