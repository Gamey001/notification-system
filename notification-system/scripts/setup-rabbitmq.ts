import * as amqp from "amqplib";
import { QueueConfig } from "libs/common/src";

async function setupRabbitMQ() {
  try {
    console.log("Connecting to RabbitMQ...");
    const connection = await amqp.connect(
      "amqp://admin:password@localhost:5672"
    );
    const channel = await connection.createChannel();

    console.log("Setting up Dead Letter Exchange and Queue...");
    await channel.assertExchange(QueueConfig.DLX.EXCHANGE, "direct", {
      durable: true,
    });
    await channel.assertQueue(QueueConfig.DLX.QUEUE, { durable: true });
    await channel.bindQueue(
      QueueConfig.DLX.QUEUE,
      QueueConfig.DLX.EXCHANGE,
      "#"
    );

    console.log("Setting up Main Exchange...");
    await channel.assertExchange(QueueConfig.EXCHANGE, "direct", {
      durable: true,
    });

    console.log("Setting up Email Queue...");
    await channel.assertQueue(QueueConfig.QUEUES.EMAIL, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": QueueConfig.DLX.EXCHANGE,
        "x-dead-letter-routing-key": "email.failed",
      },
    });
    await channel.bindQueue(
      QueueConfig.QUEUES.EMAIL,
      QueueConfig.EXCHANGE,
      QueueConfig.ROUTING_KEYS.EMAIL
    );

    console.log("Setting up Push Queue...");
    await channel.assertQueue(QueueConfig.QUEUES.PUSH, {
      durable: true,
      arguments: {
        "x-dead-letter-exchange": QueueConfig.DLX.EXCHANGE,
        "x-dead-letter-routing-key": "push.failed",
      },
    });
    await channel.bindQueue(
      QueueConfig.QUEUES.PUSH,
      QueueConfig.EXCHANGE,
      QueueConfig.ROUTING_KEYS.PUSH
    );

    console.log("Setting up Failed Queue...");
    await channel.assertQueue(QueueConfig.QUEUES.FAILED, { durable: true });
    await channel.bindQueue(
      QueueConfig.QUEUES.FAILED,
      QueueConfig.EXCHANGE,
      QueueConfig.ROUTING_KEYS.FAILED
    );

    console.log("✅ RabbitMQ setup completed successfully!");

    await channel.close();
    await connection.close();
  } catch (error) {
    console.error("❌ Failed to setup RabbitMQ:", error);
    process.exit(1);
  }
}

setupRabbitMQ();
