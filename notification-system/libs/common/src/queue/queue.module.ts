import { Module, Global } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RabbitMQSetupService } from "../services/rabbitmq-setup.service";
import { QueuePublisherService } from "../services/queue-publisher.service";
import { RetryService } from "../services/retry.service";
import { CircuitBreakerService } from "../services/circuit-breaker.service";

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    RabbitMQSetupService,
    QueuePublisherService,
    RetryService,
    CircuitBreakerService,
  ],
  exports: [
    RabbitMQSetupService,
    QueuePublisherService,
    RetryService,
    CircuitBreakerService,
  ],
})
export class QueueModule {}
