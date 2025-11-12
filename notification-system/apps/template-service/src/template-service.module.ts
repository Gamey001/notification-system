import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { Template } from "./entities/template.entity";
import { TemplateVersion } from "./entities/template-version.entity";
import { TemplateController } from "./controllers/template.controller";
import { TemplateService } from "./services/template.service";
import { TemplateRendererService } from "./services/template-renderer.service";

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
        database: configService.get("DB_NAME", "template_service_db"),
        entities: [Template, TemplateVersion],
        synchronize: configService.get("NODE_ENV") !== "production",
        logging: configService.get("NODE_ENV") === "development",
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Template, TemplateVersion]),
  ],
  controllers: [TemplateController],
  providers: [TemplateService, TemplateRendererService],
  exports: [TemplateService, TemplateRendererService],
})
export class TemplateServiceModule {}
