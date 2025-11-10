import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";
import { UserServiceModule } from "./user-service.module";

async function bootstrap() {
  const app = await NestFactory.create(UserServiceModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    })
  );

  app.enableCors();

  const port = process.env.PORT || 3001;
  await app.listen(port);

  console.log(`User Service is running on: http://localhost:${port}`);
}
bootstrap();
