"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const user_service_module_1 = require("./user-service.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(user_service_module_1.UserServiceModule);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.enableCors();
    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`User Service is running on: http://localhost:${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map