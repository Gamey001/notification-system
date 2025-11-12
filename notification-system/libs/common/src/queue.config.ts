export const QueueConfig = {
  EXCHANGE: "notifications.direct",
  QUEUES: {
    EMAIL: "email_queue",
    PUSH: "push_queue",
    FAILED: "failed_queue",
  },
  ROUTING_KEYS: {
    EMAIL: "notification.email",
    PUSH: "notification.push",
    FAILED: "notification.failed",
  },
  DLX: {
    EXCHANGE: "notifications.dlx",
    QUEUE: "dead_letter_queue",
  },
  RETRY: {
    MAX_ATTEMPTS: 3,
    INITIAL_DELAY: 1000, // 1 second
    MAX_DELAY: 60000, // 1 minute
    MULTIPLIER: 2, // Exponential backoff multiplier
  },
};
