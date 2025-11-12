import { Injectable, Logger } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  EmailNotification,
  EmailStatus,
} from "../entities/email-notification.entity";
import { SendEmailDto } from "../dto/email-notification.dto";

@Injectable()
export class EmailNotificationService {
  private readonly logger = new Logger(EmailNotificationService.name);

  constructor(
    @InjectRepository(EmailNotification)
    private emailNotificationRepository: Repository<EmailNotification>
  ) {}

  async create(sendEmailDto: SendEmailDto): Promise<EmailNotification> {
    const notification = this.emailNotificationRepository.create({
      id: sendEmailDto.id,
      correlation_id: sendEmailDto.correlation_id,
      user_id: sendEmailDto.user_id,
      template_id: sendEmailDto.template_id,
      recipient_email: sendEmailDto.recipient_email,
      subject: sendEmailDto.subject,
      content: sendEmailDto.content,
      html_content: sendEmailDto.html_content,
      variables: sendEmailDto.variables,
      metadata: sendEmailDto.metadata,
      retry_count: sendEmailDto.retry_count || 0,
      status: EmailStatus.PENDING,
    });

    return this.emailNotificationRepository.save(notification);
  }

  async updateStatus(
    id: string,
    status: EmailStatus,
    errorMessage?: string
  ): Promise<void> {
    const updateData: any = { status };

    if (status === EmailStatus.SENT) {
      updateData.sent_at = new Date();
    }

    if (errorMessage) {
      updateData.error_message = errorMessage;
    }

    await this.emailNotificationRepository.update(id, updateData);
  }

  async incrementRetryCount(id: string): Promise<void> {
    await this.emailNotificationRepository.increment({ id }, "retry_count", 1);
  }

  async findById(id: string): Promise<EmailNotification> {
    return this.emailNotificationRepository.findOne({ where: { id } });
  }

  async findByCorrelationId(
    correlationId: string
  ): Promise<EmailNotification[]> {
    return this.emailNotificationRepository.find({
      where: { correlation_id: correlationId },
    });
  }

  async getStatistics() {
    const total = await this.emailNotificationRepository.count();
    const sent = await this.emailNotificationRepository.count({
      where: { status: EmailStatus.SENT },
    });
    const failed = await this.emailNotificationRepository.count({
      where: { status: EmailStatus.FAILED },
    });
    const pending = await this.emailNotificationRepository.count({
      where: { status: EmailStatus.PENDING },
    });

    return {
      total,
      sent,
      failed,
      pending,
      success_rate: total > 0 ? ((sent / total) * 100).toFixed(2) + "%" : "0%",
    };
  }
}
