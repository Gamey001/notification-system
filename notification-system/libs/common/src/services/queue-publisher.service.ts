import { Injectable, Logger } from "@nestjs/common";
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from "@nestjs/microservices";
import { ConfigService } from "@nestjs/config";
import { QueueConfig } from "../queue.config";
import {
  NotificationPayload,
  NotificationType,
} from "../interfaces/notification.interface";

@Injectable()
export class QueuePublisherService {
  private readonly logger = new Logger(QueuePublisherService.name);
  private emailClient: ClientProxy;
  private pushClient: ClientProxy;

  constructor(private readonly configService: ConfigService) {
    this.initializeClients();
  }

  /**
   * Initialize RabbitMQ clients for email and push queues.
   */
  private initializeClients() {
    const url =
      this.configService.get<string>("RABBITMQ_URL") ||
      "amqp://admin:password@localhost:5672";

    // Email Queue Client
    this.emailClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: QueueConfig.QUEUES.EMAIL,
        queueOptions: {
          durable: true,
        },
      },
    });

    // Push Queue Client
    this.pushClient = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [url],
        queue: QueueConfig.QUEUES.PUSH,
        queueOptions: {
          durable: true,
        },
      },
    });
  }

  /**
   * Publish a single notification message to the appropriate queue.
   */
  async publishNotification(payload: NotificationPayload): Promise<string> {
    try {
      // ✅ Dynamically import uuid (fix for CommonJS)
      const { v4: uuidv4 } = await import("uuid");

      // Generate correlation ID if not provided
      if (!payload.correlation_id) {
        payload.correlation_id = uuidv4();
      }

      // Choose the correct queue and message pattern
      const client =
        payload.type === NotificationType.EMAIL
          ? this.emailClient
          : this.pushClient;

      const pattern =
        payload.type === NotificationType.EMAIL ? "send_email" : "send_push";

      this.logger.log(
        `Publishing ${payload.type} notification - ID: ${payload.id ?? "N/A"}, Correlation: ${payload.correlation_id}`
      );

      // Publish message (fire-and-forget)
      await client.emit(pattern, payload).toPromise();

      return payload.correlation_id;
    } catch (error) {
      this.logger.error(
        `Failed to publish notification: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  /**
   * Publish multiple notifications in bulk.
   */
  async publishBulkNotifications(
    payloads: NotificationPayload[]
  ): Promise<string[]> {
    const correlationIds: string[] = [];

    for (const payload of payloads) {
      try {
        const correlationId = await this.publishNotification(payload);
        correlationIds.push(correlationId);
      } catch (error) {
        this.logger.error(
          `Failed to publish bulk notification: ${error.message}`
        );
      }
    }

    return correlationIds;
  }

  /**
   * Close all RabbitMQ clients when the module is destroyed.
   */
  async onModuleDestroy() {
    await Promise.allSettled([
      this.emailClient.close(),
      this.pushClient.close(),
    ]);
    this.logger.log("QueuePublisherService connections closed gracefully.");
  }
}
