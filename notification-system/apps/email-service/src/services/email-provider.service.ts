import { Injectable, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as nodemailer from "nodemailer";
import { Transporter } from "nodemailer";
import { getEmailConfig, EmailConfig } from "../config/email.config";

export interface EmailPayload {
  to: string;
  subject: string;
  text: string;
  html?: string;
  from?: string;
}

@Injectable()
export class EmailProviderService {
  private readonly logger = new Logger(EmailProviderService.name);
  private transporter: Transporter;
  private config: EmailConfig;

  constructor(private configService: ConfigService) {
    this.config = getEmailConfig();
    this.initializeTransporter();
  }

  private initializeTransporter() {
    if (this.config.provider === "smtp") {
      this.transporter = nodemailer.createTransport({
        host: this.config.smtp.host,
        port: this.config.smtp.port,
        secure: this.config.smtp.secure,
        auth: {
          user: this.config.smtp.auth.user,
          pass: this.config.smtp.auth.pass,
        },
      });

      this.logger.log(
        `Email transporter initialized with SMTP: ${this.config.smtp.host}`
      );
    }
  }

  async sendEmail(payload: EmailPayload): Promise<any> {
    try {
      const from =
        payload.from || `${this.config.from.name} <${this.config.from.email}>`;

      const mailOptions = {
        from,
        to: payload.to,
        subject: payload.subject,
        text: payload.text,
        html: payload.html || payload.text,
      };

      this.logger.log(
        `Sending email to ${payload.to} with subject: ${payload.subject}`
      );

      if (this.config.provider === "smtp") {
        const info = await this.transporter.sendMail(mailOptions);
        this.logger.log(`Email sent successfully: ${info.messageId}`);
        return info;
      }

      // Add other providers (SendGrid, Mailgun) here if needed

      throw new Error(`Unsupported email provider: ${this.config.provider}`);
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.message}`, error.stack);
      throw error;
    }
  }

  async verifyConnection(): Promise<boolean> {
    try {
      if (this.config.provider === "smtp") {
        await this.transporter.verify();
        this.logger.log("Email service connection verified");
        return true;
      }
      return true;
    } catch (error) {
      this.logger.error(`Email service connection failed: ${error.message}`);
      return false;
    }
  }
}
