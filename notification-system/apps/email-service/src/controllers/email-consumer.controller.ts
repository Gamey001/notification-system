import { Controller, Logger } from "@nestjs/common";
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from "@nestjs/microservices";
import { EmailProcessorService } from "../services/email-processor.service";
import { SendEmailDto } from "../dto/email-notification.dto";

@Controller()
export class EmailConsumerController {
  private readonly logger = new Logger(EmailConsumerController.name);

  constructor(private emailProcessorService: EmailProcessorService) {}

  @MessagePattern("send_email")
  async handleSendEmail(
    @Payload() data: SendEmailDto,
    @Ctx() context: RmqContext
  ) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    this.logger.log(
      `Received email notification - ID: ${data.id}, Correlation: ${data.correlation_id}`
    );

    try {
      await this.emailProcessorService.processEmail(data);

      // Acknowledge the message
      channel.ack(originalMsg);
      this.logger.log(`Message acknowledged - ID: ${data.id}`);
    } catch (error) {
      this.logger.error(
        `Failed to process email message - ID: ${data.id}`,
        error.stack
      );

      // Check retry count
      const retryCount = data.retry_count || 0;
      const maxRetries = 3;

      if (retryCount >= maxRetries) {
        // Send to dead letter queue
        this.logger.error(
          `Max retries exceeded, rejecting message - ID: ${data.id}`
        );
        channel.nack(originalMsg, false, false);
      } else {
        // Requeue for retry
        this.logger.warn(
          `Requeuing message for retry - ID: ${data.id}, Attempt: ${retryCount + 1}`
        );
        channel.nack(originalMsg, false, true);
      }
    }
  }
}
