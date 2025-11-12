import { Injectable, Logger } from "@nestjs/common";

export enum CircuitState {
  CLOSED = "closed",
  OPEN = "open",
  HALF_OPEN = "half_open",
}

interface CircuitBreakerConfig {
  failureThreshold: number;
  successThreshold: number;
  timeout: number;
  resetTimeout: number;
}

interface CircuitBreakerState {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime: number | null;
  config: CircuitBreakerConfig;
}

@Injectable()
export class CircuitBreakerService {
  private readonly logger = new Logger(CircuitBreakerService.name);
  private circuits: Map<string, CircuitBreakerState> = new Map();

  private defaultConfig: CircuitBreakerConfig = {
    failureThreshold: 5, // Open after 5 failures
    successThreshold: 2, // Close after 2 successes in half-open
    timeout: 60000, // 1 minute timeout
    resetTimeout: 30000, // Try to reset after 30 seconds
  };

  /**
   * Retrieves or creates a circuit state for the given circuit name.
   */
  private getCircuit(name: string): CircuitBreakerState {
    let circuit = this.circuits.get(name);
    if (!circuit) {
      circuit = {
        state: CircuitState.CLOSED,
        failureCount: 0,
        successCount: 0,
        lastFailureTime: null,
        config: this.defaultConfig,
      };
      this.circuits.set(name, circuit);
    }
    return circuit;
  }

  /**
   * Executes a protected operation with circuit breaker logic.
   */
  async execute<T>(
    circuitName: string,
    operation: () => Promise<T>,
    fallback?: () => Promise<T>
  ): Promise<T> {
    const circuit = this.getCircuit(circuitName);

    // Check if circuit is open
    if (circuit.state === CircuitState.OPEN) {
      const timeSinceLastFailure = Date.now() - (circuit.lastFailureTime ?? 0);

      if (timeSinceLastFailure > circuit.config.resetTimeout) {
        this.logger.log(`Circuit ${circuitName} transitioning to HALF_OPEN`);
        circuit.state = CircuitState.HALF_OPEN;
        circuit.successCount = 0;
      } else {
        this.logger.warn(`Circuit ${circuitName} is OPEN, using fallback`);
        if (fallback) {
          return fallback();
        }
        throw new Error(`Circuit ${circuitName} is open`);
      }
    }

    try {
      const result = await Promise.race([
        operation(),
        this.timeout(circuit.config.timeout),
      ]);

      this.onSuccess(circuitName);
      return result as T;
    } catch (error) {
      this.onFailure(circuitName, error);

      if (fallback) {
        this.logger.log(`Using fallback for circuit ${circuitName}`);
        return fallback();
      }

      throw error;
    }
  }

  /**
   * Handles a successful operation.
   */
  private onSuccess(circuitName: string) {
    const circuit = this.getCircuit(circuitName);
    circuit.failureCount = 0;

    if (circuit.state === CircuitState.HALF_OPEN) {
      circuit.successCount++;

      if (circuit.successCount >= circuit.config.successThreshold) {
        this.logger.log(`Circuit ${circuitName} transitioning to CLOSED`);
        circuit.state = CircuitState.CLOSED;
        circuit.successCount = 0;
      }
    }
  }

  /**
   * Handles a failed operation.
   */
  private onFailure(circuitName: string, error: any) {
    const circuit = this.getCircuit(circuitName);
    circuit.failureCount++;
    circuit.lastFailureTime = Date.now();

    this.logger.warn(
      `Circuit ${circuitName} failure count: ${circuit.failureCount}/${circuit.config.failureThreshold}`
    );

    if (
      circuit.state === CircuitState.HALF_OPEN ||
      circuit.failureCount >= circuit.config.failureThreshold
    ) {
      this.logger.error(`Circuit ${circuitName} transitioning to OPEN`);
      circuit.state = CircuitState.OPEN;
    }
  }

  /**
   * Timeout helper.
   */
  private timeout(ms: number): Promise<never> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Operation timeout")), ms)
    );
  }

  /**
   * Returns current state of the circuit.
   */
  getCircuitState(circuitName: string): CircuitState {
    const circuit = this.getCircuit(circuitName);
    return circuit.state;
  }

  /**
   * Returns stats for a circuit.
   */
  getCircuitStats(circuitName: string) {
    const circuit = this.getCircuit(circuitName);
    return {
      name: circuitName,
      state: circuit.state,
      failureCount: circuit.failureCount,
      successCount: circuit.successCount,
      lastFailureTime: circuit.lastFailureTime,
    };
  }

  /**
   * Manually resets a circuit.
   */
  resetCircuit(circuitName: string) {
    const circuit = this.getCircuit(circuitName);
    circuit.state = CircuitState.CLOSED;
    circuit.failureCount = 0;
    circuit.successCount = 0;
    circuit.lastFailureTime = null;

    this.logger.log(`Circuit ${circuitName} has been manually reset`);
  }
}
