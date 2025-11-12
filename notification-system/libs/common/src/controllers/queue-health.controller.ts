import { Controller, Get } from "@nestjs/common";
import { CircuitBreakerService } from "../services/circuit-breaker.service";
import { QueueConfig } from "..";

@Controller("queue")
export class QueueHealthController {
  constructor(private circuitBreakerService: CircuitBreakerService) {}

  @Get("health")
  async getQueueHealth() {
    return {
      success: true,
      message: "Queue system health check",
      data: {
        status: "healthy",
        queues: {
          email: QueueConfig.QUEUES.EMAIL,
          push: QueueConfig.QUEUES.PUSH,
          failed: QueueConfig.QUEUES.FAILED,
        },
        circuits: {
          email: this.circuitBreakerService.getCircuitStats("email_service"),
          push: this.circuitBreakerService.getCircuitStats("push_service"),
        },
        timestamp: new Date().toISOString(),
      },
    };
  }
}
