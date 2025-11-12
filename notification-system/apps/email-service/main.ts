import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { Transport, MicroserviceOptions } from "@nestjs/microservices";
import { EmailServiceModule } from "./src/email-service.module";

async function bootstrap() {
  // Create hybrid application (HTTP + RabbitMQ)
  const app = await NestFactory.create(EmailServiceModule);

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.enableCors();

  // Connect to RabbitMQ as microservice
  const rabbitmqUrl =
    process.env.RABBITMQ_URL || "amqp://admin:password@localhost:5672";

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: [rabbitmqUrl],
      queue: "email_queue",
      queueOptions: {
        durable: true,
      },
      prefetchCount: 10, // Process 10 messages at a time
    },
  });

  await app.startAllMicroservices();

  const port = process.env.PORT || 3003;
  await app.listen(port);

  console.log(`Email Service is running on: http://localhost:${port}`);
  console.log(`Email Service connected to RabbitMQ: ${rabbitmqUrl}`);
}

bootstrap();
