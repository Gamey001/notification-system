import { Controller, Get, Param, Query } from "@nestjs/common";
import { EmailNotificationService } from "../services/email-notification.service";
import { EmailProviderService } from "../services/email-provider.service";

@Controller("emails")
export class EmailController {
  constructor(
    private emailNotificationService: EmailNotificationService,
    private emailProviderService: EmailProviderService
  ) {}

  @Get("statistics")
  async getStatistics() {
    const stats = await this.emailNotificationService.getStatistics();

    return {
      success: true,
      message: "Email statistics retrieved successfully",
      data: stats,
    };
  }

  @Get("correlation/:correlation_id")
  async getByCorrelationId(@Param("correlation_id") correlationId: string) {
    const notifications =
      await this.emailNotificationService.findByCorrelationId(correlationId);

    return {
      success: true,
      message: "Email notifications retrieved successfully",
      data: notifications,
    };
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    const notification = await this.emailNotificationService.findById(id);

    return {
      success: true,
      message: "Email notification retrieved successfully",
      data: notification,
    };
  }

  @Get("health")
  async healthCheck() {
    const isConnected = await this.emailProviderService.verifyConnection();

    return {
      success: true,
      message: "Email service health check",
      data: {
        status: isConnected ? "healthy" : "degraded",
        email_provider: isConnected ? "connected" : "disconnected",
        timestamp: new Date().toISOString(),
      },
    };
  }
}
