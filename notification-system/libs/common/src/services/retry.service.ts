import { Injectable, Logger } from "@nestjs/common";
import { QueueConfig } from "../queue.config";
import { NotificationPayload } from "../interfaces/notification.interface";

@Injectable()
export class RetryService {
  private readonly logger = new Logger(RetryService.name);

  shouldRetry(retryCount: number): boolean {
    return retryCount < QueueConfig.RETRY.MAX_ATTEMPTS;
  }

  calculateDelay(retryCount: number): number {
    const delay = Math.min(
      QueueConfig.RETRY.INITIAL_DELAY *
        Math.pow(QueueConfig.RETRY.MULTIPLIER, retryCount),
      QueueConfig.RETRY.MAX_DELAY
    );
    return delay;
  }

  async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  prepareRetryPayload(
    payload: NotificationPayload,
    error: string
  ): NotificationPayload {
    const retryCount = (payload.retry_count || 0) + 1;

    return {
      ...payload,
      retry_count: retryCount,
      metadata: {
        ...payload.metadata,
        last_error: error,
        last_retry_at: new Date().toISOString(),
        retry_history: [
          ...(payload.metadata?.retry_history || []),
          {
            attempt: retryCount,
            error,
            timestamp: new Date().toISOString(),
          },
        ],
      },
    };
  }

  async executeWithRetry<T>(
    operation: () => Promise<T>,
    payload: NotificationPayload,
    onRetry?: (payload: NotificationPayload) => Promise<void>
  ): Promise<T> {
    const retryCount = payload.retry_count || 0;

    try {
      return await operation();
    } catch (error) {
      this.logger.warn(
        `Operation failed (attempt ${retryCount + 1}/${
          QueueConfig.RETRY.MAX_ATTEMPTS
        }): ${error.message}`
      );

      if (this.shouldRetry(retryCount)) {
        const delay = this.calculateDelay(retryCount);
        this.logger.log(`Retrying in ${delay}ms...`);

        await this.delay(delay);

        const retryPayload = this.prepareRetryPayload(payload, error.message);

        if (onRetry) {
          await onRetry(retryPayload);
        }

        return this.executeWithRetry(operation, retryPayload, onRetry);
      } else {
        this.logger.error(
          `Max retry attempts reached for notification: ${payload.id}`
        );
        throw error;
      }
    }
  }
}
