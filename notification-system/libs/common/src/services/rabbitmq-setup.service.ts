import { Injectable, OnModuleInit, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as amqp from "amqplib";
import { QueueConfig } from "../queue.config";

@Injectable()
export class RabbitMQSetupService implements OnModuleInit {
  private readonly logger = new Logger(RabbitMQSetupService.name);
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private configService: ConfigService) {}

  async onModuleInit() {
    await this.setupRabbitMQ();
  }

  private async setupRabbitMQ() {
    try {
      const url =
        this.configService.get("RABBITMQ_URL") ||
        "amqp://admin:password@localhost:5672";

      this.logger.log("Connecting to RabbitMQ...");
      this.connection = await amqp.connect(url);
      this.channel = await this.connection.createChannel();

      this.logger.log("Setting up exchanges and queues...");

      // Setup Dead Letter Exchange and Queue
      await this.channel.assertExchange(QueueConfig.DLX.EXCHANGE, "direct", {
        durable: true,
      });

      await this.channel.assertQueue(QueueConfig.DLX.QUEUE, {
        durable: true,
      });

      await this.channel.bindQueue(
        QueueConfig.DLX.QUEUE,
        QueueConfig.DLX.EXCHANGE,
        "#"
      );

      // Setup Main Exchange
      await this.channel.assertExchange(QueueConfig.EXCHANGE, "direct", {
        durable: true,
      });

      // Setup Email Queue with DLX
      await this.channel.assertQueue(QueueConfig.QUEUES.EMAIL, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": QueueConfig.DLX.EXCHANGE,
          "x-dead-letter-routing-key": "email.failed",
        },
      });

      await this.channel.bindQueue(
        QueueConfig.QUEUES.EMAIL,
        QueueConfig.EXCHANGE,
        QueueConfig.ROUTING_KEYS.EMAIL
      );

      // Setup Push Queue with DLX
      await this.channel.assertQueue(QueueConfig.QUEUES.PUSH, {
        durable: true,
        arguments: {
          "x-dead-letter-exchange": QueueConfig.DLX.EXCHANGE,
          "x-dead-letter-routing-key": "push.failed",
        },
      });

      await this.channel.bindQueue(
        QueueConfig.QUEUES.PUSH,
        QueueConfig.EXCHANGE,
        QueueConfig.ROUTING_KEYS.PUSH
      );

      // Setup Failed Queue
      await this.channel.assertQueue(QueueConfig.QUEUES.FAILED, {
        durable: true,
      });

      await this.channel.bindQueue(
        QueueConfig.QUEUES.FAILED,
        QueueConfig.EXCHANGE,
        QueueConfig.ROUTING_KEYS.FAILED
      );

      this.logger.log("RabbitMQ setup completed successfully");
    } catch (error) {
      this.logger.error("Failed to setup RabbitMQ", error);
      throw error;
    }
  }

  async getChannel(): Promise<amqp.Channel> {
    if (!this.channel) {
      await this.setupRabbitMQ();
    }
    return this.channel;
  }

  async closeConnection() {
    if (this.channel) await this.channel.close();
    if (this.connection) await this.connection.close();
  }
}
