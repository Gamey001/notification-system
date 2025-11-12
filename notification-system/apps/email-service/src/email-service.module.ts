import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { QueueModule } from "@app/common";
import { EmailNotification } from "./entities/email-notification.entity";
import { EmailConsumerController } from "./controllers/email-consumer.controller";
import { EmailController } from "./controllers/email.controller";
import { EmailProviderService } from "./services/email-provider.service";
import { EmailNotificationService } from "./services/email-notification.service";
import { EmailProcessorService } from "./services/email-processor.service";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DB_HOST", "localhost"),
        port: configService.get("DB_PORT", 5432),
        username: configService.get("DB_USERNAME", "postgres"),
        password: configService.get("DB_PASSWORD", "password"),
        database: configService.get("DB_NAME", "email_service_db"),
        entities: [EmailNotification],
        synchronize: configService.get("NODE_ENV") !== "production",
        logging: configService.get("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([EmailNotification]),
    QueueModule,
  ],
  controllers: [EmailConsumerController, EmailController],
  providers: [
    EmailProviderService,
    EmailNotificationService,
    EmailProcessorService,
  ],
})
export class EmailServiceModule {}
